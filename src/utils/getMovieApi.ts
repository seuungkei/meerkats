import axios from 'axios';
import dotenv from 'dotenv';
import MyCustomError from './customError';
import { MovieInfoDTO, MovieDTO, MovieDetailInfoDTO, MovieDetailDTO, combinedDTO } from '../dto/movie.dto';
import { InsertData } from './insertDatabase';

dotenv.config();

class getMovieApi {
  private readonly movieApiKey: string | undefined;
  private readonly movieApiSecondKey: string | undefined;
  private readonly REGEX =
    /{"movieCd":"\d+\w*"|\s*"movieNm":"[^"]*"|"movieNmEn":"[^"]*"|"openDt":"\d+"|"genreAlt":"[^"]*"|"repNationNm":"[^"]*"|"directors":\[|(?<="peopleNm":)"\W*"(?=})|(?=],)]|(?<=])}/g;
  private readonly DETAIL_REGEX = /(?<=ult":){|"showTm":"\w*"|"actors":\[|](?=,"showTy)|(?<=leNm":)"\W*"|"watchGradeNm":"[^"]*"|(?<=회")}/g;

  constructor(private InsertData: InsertData) {
    this.movieApiKey = process.env.MOVIE_API_KEY;
    this.movieApiSecondKey = process.env.MOVIE_API_SECOND_KEY;
  }

  public parseMovieDataList = async () => {
    try {
      let dataArray: MovieDTO[] = [];

      for (let i = 1065; i <= 1066; i++) {
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

      const combinedData = categoryFilter.map((movie, index) => ({
        name: movie.movieNm || '',
        english_name: movie.movieNmEn || '',
        release_data: movie.openDt || '',
        // category: movie.genreAlt || '',
        // region: movie.repNationNm || '',
        director: movie.directors || [],
        running_time: parseDetailData[index]?.showTm + '분' || '',
        actor: parseDetailData[index]?.actors?.slice(0, 10) || [],
      }));
      const result = await this.InsertData.movieData(combinedData);
      console.log(result);
      return result;
    } catch (err) {
      console.error('DATA_ERROR', err);
      return [];
    }
  };
}

export default getMovieApi;
