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

interface VideoSnippet {
  title: string;
  thumbnails: {
    medium: {
      url: string;
    };
  };
  channelTitle: string;
  publishedAt: string;
}

interface VideoStatistics {
  viewCount: string;
}

interface Video {
  id: {
    videoId: string;
  };
  snippet: VideoSnippet;
  statistics: VideoStatistics;
}

interface Response {
  items: Video[];
}

interface MovieTrailerDetail {
  category: {
    id: number;
    name: string;
  } | null;
  release_date: Date | null;
  name: string;
  english_name: string | null;
  summary: string | null;
  director: string | null;
  actor: string | null;
  rating: {
    id: number;
    name: string;
  } | null;
  running_time: string | null;
  region: {
    id: number;
    name: string;
  } | null;
  movieLikesCount: number;
  isLikedByThisUser: boolean;
}

interface MovieDetailAndMore {
  movieTrailerComments: MovieComments[];
  blogLikesAndPopularitySorting: Posts[];
}

interface MovieComments {
  commentId: number;
  content: string;
  created_at: Date;
  user: {
    id: number;
    nickname: string | null;
  };
}

interface Posts {
  id: number;
  user: {
    id: number;
    nickname: string | null;
  };
  title: string;
  thumbnail: string;
  created_at: Date;
  weeklyLikeCount: number;
}

interface ParseMovieData {
  mainYoutube: {
    videoId: string;
    title: string;
    thumbnail: string;
    channel: string;
  };
  playlistYoutube: {
    videoId: string;
    title: string;
    channel: string;
    thumbnail: string;
    viewCount: number;
    publishedAt: string;
  }[];
}

export { Video, VideoSnippet, Response, MovieTrailerDetail, MovieComments, Posts, ParseMovieData, MovieDetailAndMore, LikeWithMainMovie, BestMovie, MainMovie, AllMainMovie };
