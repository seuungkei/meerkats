interface MovieInfoDTO {
  movieCd: string;
  movieNm: string;
  movieNmEn: string;
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
  name: string;
  english_name: string;
  release_data: string;
  category: string;
  region: string;
  director: string[];
  running_time: string;
  actor: string[] | Person[];
}

export { MovieInfoDTO, MovieDTO, Person, MovieDetailInfoDTO, MovieDetailDTO, combinedDTO };
