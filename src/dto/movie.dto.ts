interface MovieInfoDTO {
  movieCd: string;
  movieNm: string;
  prdtYear: string;
  prdtStatNm?: string;
  production_year: string;
  openDt?: string;
  release_data: string;
  genreAlt: string;
  category: string;
  repNationNm: string;
  directors: string[];
}

interface MovieDTO {
  movieListResult: {
    totCnt: string;
    source: string;
    movieList: MovieInfoDTO[];
  };
}

interface Person {
  peopleNm: string;
  peopleNmEn: string;
}

interface MovieDetailInfoDTO {
  movieCd: string;
  movieNm: string;
  showTm: string;
  prdtStatNm: string;
  directors?: Person[];
  actors?: Person[] | string[];
  staffs?: Person[] | null;
  watchGradeNm: string;
}

interface MovieDetailDTO {
  movieInfoResult: {
    movieInfo: MovieDetailInfoDTO;
    source: string;
  };
}

interface combinedDTO {
  movie_code: string;
  name: string;
  production_year: string;
  release_data: string;
  category: string;
  region: string;
  director: string[];
  running_time: string;
  actor: string[] | Person[];
  ratings: string;
}

export { MovieInfoDTO, MovieDTO, Person, MovieDetailInfoDTO, MovieDetailDTO, combinedDTO };
