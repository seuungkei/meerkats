import { MovieRepository } from '../repositories/movieRepository';
import { Video, Response, MovieTrailerDetail, ParseMovieData } from '../dto/movie.dto';
import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class MovieService {
  private readonly YOUTUBE_API_KEY: string | undefined;
  private readonly axiosInstance: AxiosInstance;
  constructor(private Repository: MovieRepository) {
    this.YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    this.axiosInstance = axios.create({
      baseURL: 'https://www.googleapis.com/youtube/v3/',
    });
  }

  public getMovieTrailerDetail = async (movieId: number, skip: number, take: number): Promise<ParseMovieData> => {
    const movieTrailerDetailData: MovieTrailerDetail = await this.Repository.getMovieTrailerDetail(movieId, skip, take);

    const mainVideo = await this.getMovieTrailerVideoId(movieTrailerDetailData.name);
    const playlistVideoId = await this.getMovieTrailerPlaylist(mainVideo.id.videoId);
    const playlistVideo = await this.getMovieTrailerPlaylistData(playlistVideoId.join());

    const result = {
      ...movieTrailerDetailData,
      movieTrailerMainData: {
        videoId: mainVideo.id.videoId,
        title: mainVideo.snippet.title,
        thumbnail: mainVideo.snippet.thumbnails.default.url,
        channel: mainVideo.snippet.channelTitle,
      },
      movieTrailerPlaylistData: playlistVideo.map((items: any) => ({
        videoId: items.id,
        title: items.snippet.title,
        channel: items.snippet.channelTitle,
        thumbnail: items.snippet.thumbnails.default.url,
        viewCount: items.statistics.viewCount,
        publishedAt: items.snippet.publishedAt,
      })),
    };
    return result;
  };

  private getMovieTrailerVideoId = async (movieName: string): Promise<Video> => {
    const response = await this.axiosInstance.get<Response>('search', {
      params: {
        part: 'snippet',
        maxResults: '1',
        q: `${movieName} trailer`,
        type: 'video',
        key: this.YOUTUBE_API_KEY,
      },
    });
    return response.data.items[0];
  };

  private getMovieTrailerPlaylist = async (videoId: string): Promise<string[]> => {
    const response = await this.axiosInstance.get<Response>('search', {
      params: {
        part: 'snippet',
        maxResults: '10',
        type: 'video',
        relatedToVideoId: videoId,
        key: this.YOUTUBE_API_KEY,
      },
    });
    return response.data.items.map((movie: any) => movie.id.videoId);
  };

  private getMovieTrailerPlaylistData = async (videoId: string): Promise<Video[]> => {
    const response = await this.axiosInstance.get<Response>('videos', {
      params: {
        part: 'snippet,statistics',
        id: videoId,
        key: this.YOUTUBE_API_KEY,
      },
    });
    return response.data.items;
  };
}

export { MovieService };
