import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';
import { Video, Response } from '../dto/movie.dto';

dotenv.config();

class YoutubeApi {
  private readonly YOUTUBE_API_KEY_FIRST: string | undefined;
  private readonly YOUTUBE_API_KEY_SECOND: string | undefined;
  private readonly YOUTUBE_API_KEY_THIRD: string | undefined;
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.YOUTUBE_API_KEY_FIRST = process.env.YOUTUBE_API_KEY_FIRST;
    this.YOUTUBE_API_KEY_SECOND = process.env.YOUTUBE_API_KEY_SECOND;
    this.YOUTUBE_API_KEY_THIRD = process.env.YOUTUBE_API_KEY_THIRD;
    this.axiosInstance = axios.create({
      baseURL: 'https://www.googleapis.com/youtube/v3/',
    });
  }

  public getMovieTrailerVideoId = async (movieName: string): Promise<Video> => {
    const response = await this.axiosInstance.get<Response>('search', {
      params: {
        part: 'snippet',
        maxResults: '1',
        q: `${movieName} trailer`,
        type: 'video',
        key: this.YOUTUBE_API_KEY_FIRST,
      },
    });

    console.log(response.data.items[0]);

    return response.data.items[0];
  };

  public getMovieTrailerPlaylist = async (videoTitle: string): Promise<string[]> => {
    const response = await this.axiosInstance.get<Response>('search', {
      params: {
        part: 'snippet',
        maxResults: '11',
        type: 'video',
        q: videoTitle,
        key: this.YOUTUBE_API_KEY_SECOND,
      },
    });
    return response.data.items.map((movie: any) => movie.id.videoId);
  };

  public getMovieTrailerPlaylistData = async (videoId: string): Promise<Video[]> => {
    const response = await this.axiosInstance.get<Response>('videos', {
      params: {
        part: 'snippet,statistics',
        id: videoId,
        key: this.YOUTUBE_API_KEY_THIRD,
      },
    });
    return response.data.items;
  };
}

export { YoutubeApi };
