interface VideoSnippet {
  title: string;
  thumbnails: {
    default: {
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
  };
  release_date: Date;
  name: string;
  director: string;
  actor: string;
  ratings: string;
  running_time: string;
  region: {
    id: number;
    name: string;
  };
  movieLikesCount: number;
  movieTrailerComments: MovieComments[];
  blogLikesAndPopularitySorting: Posts[];
}

interface MovieComments {
  id: number;
  content: string;
  user: {
    id: number;
    nickname: string | null;
  };
}

interface Posts {
  id: number;
  user_id: number;
  title: string;
  thumbnail: string;
  created_at: Date;
  weeklyLikeCount: number;
}

interface ParseMovieData {
  movieTrailerMainData: {
    videoId: string;
    title: string;
    thumbnail: string;
    channel: string;
  };
  movieTrailerPlaylistData: {
    videoId: string;
    title: string;
    channel: string;
    thumbnail: string;
    viewCount: number;
    publishedAt: string;
  }[];
}

export { Video, VideoSnippet, Response, MovieTrailerDetail, MovieComments, Posts, ParseMovieData };
