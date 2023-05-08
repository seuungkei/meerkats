import { MovieRepository } from '../repositories/movieRepository';
import { MovieTrailerDetail, ParseMovieData } from '../dto/movie.dto';
import { YoutubeApi } from '../utils/youtube';
import { MovieLike } from '../dto/movie.dto';
import dotenv from 'dotenv';
import MyCustomError from '../utils/customError';

dotenv.config();
//: Promise<ParseMovieData>

class MovieService {
  constructor(private Repository: MovieRepository, private Youtube: YoutubeApi) {}

  public getMovieTrailerDetail = async (movieId: number, skip: number, take: number, userId: number) => {
    const movieTrailerDetailData: MovieTrailerDetail = await this.Repository.getMovieTrailerDetail(movieId, userId);
    const categoryId = movieTrailerDetailData?.category?.id;
    const movieDetailAndMore = await this.Repository.getMovieDetailAndMore(movieId, skip, take, Number(categoryId));

    const [mainVideo, playlistVideoTitle] = await Promise.all([this.Youtube.getMovieTrailerVideoId(movieTrailerDetailData.name), this.Youtube.getMovieTrailerPlaylist(movieTrailerDetailData.name)]);
    const playlistVideo = await this.Youtube.getMovieTrailerPlaylistData(playlistVideoTitle.join());

    const result = {
      movieInfo: { ...movieTrailerDetailData },
      andMore: movieDetailAndMore,
      mainYoutube: {
        videoId: mainVideo.id.videoId,
        title: mainVideo.snippet.title,
        thumbnail: mainVideo.snippet.thumbnails.medium.url,
        channel: mainVideo.snippet.channelTitle,
      },
      playlistYoutube: playlistVideo.map((items: any) => ({
        videoId: items.id,
        title: items.snippet.title,
        channel: items.snippet.channelTitle,
        thumbnail: items.snippet.thumbnails.medium.url,
        viewCount: items.statistics.viewCount,
        publishedAt: items.snippet.publishedAt,
      })),
    };
    return result;
  };

  public movieLikeCreateAndDelete = async (userId: number, movieId: number) => {
    const likeExists = await this.Repository.likeExists(userId, movieId);

    if (!likeExists) {
      const message = await this.Repository.createMovieLike(userId, movieId);
      return message;
    }

    const message = await this.Repository.deleteMovieLike(userId, movieId);
    return message;
  };

  public createMovieComment = async (movieId: number, content: string, userId: number) => {
    return await this.Repository.createMovieComment(movieId, content, userId);
  };

  public updateMovieComment = async (commentId: number, content: string, userId: number) => {
    const result = await this.Repository.updateMovieComment(commentId, content, userId);
    if (result.count === 0) {
      throw new MyCustomError('수정 할 권한이 없습니다.', 400);
    }
    return result;
  };

  public deleteMovieComment = async (commentId: number, userId: number) => {
    const result = await this.Repository.deleteMovieComment(commentId, userId);

    if (result.count === 0) {
      throw new MyCustomError('삭제 할 댓글이 없습니다.', 400);
    }
    return result;
  };

  public movieMainPage = async (skip: number, take: number) => {
    return await this.Repository.movieMainPage(skip, take);
  };
}

export { MovieService };
