interface LikeWithMainMovie {
  likes: number;
  id: number;
  name: string;
  release_date: Date | null;
  poster_img: string | null;
}

interface MainMovie {
  id: number;
  name: string;
  release_date: Date | null;
  poster_img: string | null;
}

interface BestMovie {
  id: number;
  name: string;
  poster_img: string | null;
  _count: {
    movie_likes: number;
  };
}

interface AllMainMovie {
  latestMovie: MainMovie[];
  koreanMovieWithLikes: LikeWithMainMovie[];
  foreignMovieWithLikes: LikeWithMainMovie[];
  bestMovie: BestMovie[];
}

export { LikeWithMainMovie, BestMovie, MainMovie, AllMainMovie };
