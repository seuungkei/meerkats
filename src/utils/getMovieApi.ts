import axios from 'axios';
import dotenv from 'dotenv';
import MyCustomError from './customError';
import { MovieInfoDTO, MovieDTO, MovieDetailInfoDTO, MovieDetailDTO, combinedDTO } from '../dto/movie.dto';

dotenv.config();

class getMovieApi {
  private readonly movieApiKey: string | undefined;
  private readonly movieApiSecondKey: string | undefined;
  private readonly REGEX =
    /{"movieCd":"\d+\w*"|\s*"movieNm":"[^"]*"|"prdtYear":"\d+"|"openDt":"\d+"|"genreAlt":"[^"]*"|"repNationNm":"[^"]*"|"directors":\[|(?<="peopleNm":)"\W*"(?=})|(?=],)]|(?<=])}/g;
  private readonly DETAIL_REGEX = /(?<=ult":){|"showTm":"\w*"|"actors":\[|](?=,"showTy)|(?<=leNm":)"\W*"|"watchGradeNm":"[^"]*"|(?<=회")}/g;

  constructor() {
    this.movieApiKey = process.env.MOVIE_API_KEY;
    this.movieApiSecondKey = process.env.MOVIE_API_SECOND_KEY;
  }

  public parseMovieDataList = async (): Promise<combinedDTO[]> => {
    try {
      let dataArray: MovieDTO[] = [];

      for (let i = 8000; i <= 8030; i++) {
        const movieDataList = await axios.get(`http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=${this.movieApiKey}&curPage=${i}`);
        if (!movieDataList) throw new MyCustomError('MOVIE_DATA_ERROR', 400);

        dataArray.push(movieDataList.data);
      }

      const prdtStatNmn = dataArray
        .map((movie) => {
          return movie.movieListResult.movieList.filter((movieInfo) => {
            return movieInfo.prdtStatNm && !movieInfo.prdtStatNm.includes('기타');
          });
        })
        .flat();

      const regexMovieDataList = JSON.stringify(prdtStatNmn).match(this.REGEX);
      const replaceDataList = regexMovieDataList?.join().replaceAll(',}', '}').replaceAll('[,', '[').replaceAll(',]', ']');
      const parseMovieData: MovieInfoDTO[] = JSON.parse(`[${replaceDataList}]`);

      const categoryFilter = parseMovieData.filter((movie) => !movie.genreAlt.includes('성인물'));

      const movieCodeArray: string[] = categoryFilter.map((el) => el.movieCd);
      const movieDatailList: MovieDetailDTO[] = await Promise.all(
        movieCodeArray.map(async (movieCode) => {
          return (await axios.get(`http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=${this.movieApiKey}&movieCd=${movieCode}`)).data;
        })
      );

      const deleteData = movieDatailList.map((movieCode) => {
        const { movieInfo } = movieCode.movieInfoResult;
        delete movieInfo.directors;
        delete movieInfo.staffs;
        return movieCode;
      });

      const regexMovieDetailDataList = JSON.stringify(deleteData).match(this.DETAIL_REGEX);
      const replaceDetailDataList = regexMovieDetailDataList
        ?.join()
        .replaceAll('{,', '{')
        .replaceAll(',}', '}')
        .replaceAll(',]', ']')
        .replaceAll('[,', '[')
        .replaceAll(',","', ',"')
        .replaceAll(',"]', ']');

      const parseDetailData: MovieDetailInfoDTO[] = JSON.parse(`[${replaceDetailDataList}]`);

      const combinedData: combinedDTO[] = categoryFilter.map((movie, index) => ({
        movie_code: movie.movieCd || '',
        name: movie.movieNm || '',
        production_year: movie.prdtYear || '',
        release_data: movie.openDt || '',
        category: movie.genreAlt || '',
        region: movie.repNationNm || '',
        director: movie.directors || [],
        running_time: parseDetailData[index]?.showTm || '',
        actor: parseDetailData[index]?.actors || [],
        ratings: parseDetailData[index]?.watchGradeNm || '',
      }));
      return combinedData;
    } catch (err) {
      console.error('DATA_ERROR', err);
      return [];
    }
  };
}

export default getMovieApi;
