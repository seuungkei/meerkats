import { MovieRepository } from '../repositories/movieRepository';
import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class MovieService {
  private readonly YOUTUBE_API_KEY: string | undefined;
  constructor(
    private Repository: MovieRepository,
    private readonly axiosInstance: AxiosInstance = axios.create({
      baseURL: 'https://www.googleapis.com/youtube/v3/',
    })
  ) {
    this.YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  }

  public getMovieTrailerDetail = async (movieId: number, take: number, skip: number) => {
    const movieTrailerDetailData = await this.Repository.getMovieTraileDetail(movieId, take, skip);

    const videoId = await this.getMovieTrailerVideoId(movieTrailerDetailData.name);
    const [videoData] = await this.getMovieTrailerData(videoId);
    const playlistData = await this.getmovieTrailerPlaylist(videoId);

    const result = {
      ...movieTrailerDetailData,
      movieTrailerMainData: {
        videoId: videoData.id,
        title: videoData.snippet.title,
        thumbnail: videoData.snippet.thumbnails.default.url,
        channel: videoData.snippet.channelTitle,
        viewCount: videoData.statistics.viewCount,
        likeCount: videoData.statistics.likeCount,
      },
      movieTrailerPlaylistData: playlistData.map((items: any) => ({
        videoId: items.id.videoId,
        title: items.snippet.title,
        channel: items.snippet.channelTitle,
        thumbnail: items.snippet.thumbnails.default.url,
      })),
    };

    return result;
  };

  private getMovieTrailerVideoId = async (movieName: string) => {
    const response = await this.axiosInstance.get('search', {
      params: {
        part: 'snippet',
        maxResults: '1',
        q: `${movieName} trailer`,
        type: 'video',
        key: this.YOUTUBE_API_KEY,
      },
    });
    return response.data.items[0].id.videoId;
  };

  private getMovieTrailerData = async (videoId: string) => {
    const response = await this.axiosInstance.get('videos', {
      params: {
        part: 'snippet,statistics',
        id: videoId,
        key: this.YOUTUBE_API_KEY,
      },
    });
    return response.data.items;
  };

  private getmovieTrailerPlaylist = async (videoId: string) => {
    const response = await this.axiosInstance.get('search', {
      params: {
        part: 'snippet',
        maxResults: '10',
        type: 'video',
        relatedToVideoId: videoId,
        key: this.YOUTUBE_API_KEY,
      },
    });
    return response.data.items;
  };
}

export { MovieService };
