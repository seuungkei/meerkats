import { movieRepository } from '../repositories/movieRepository';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class movieService {
  private readonly YOUTUBE_API_KEY: string | undefined;
  constructor(private Repository: movieRepository) {
    this.YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  }

  public movieTraileDetail = async (movieId: number, userId: number) => {
    const movieTrailerDetailData = await this.Repository.movieTraileDetail(movieId, userId);

    const getMovieTrailerVideoId = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${movieTrailerDetailData.name + ' 예고편'}&type=video&key=${this.YOUTUBE_API_KEY}`
    );
    const movieTrailerVideoId = getMovieTrailerVideoId.data.items[0].id.videoId;

    const getMovieTrailerLikesAndViews = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${movieTrailerVideoId}&key=${this.YOUTUBE_API_KEY}`);

    const [movieTrailerMainData] = getMovieTrailerLikesAndViews.data.items.map((items: any) => ({
      videoId: items.id,
      title: items.snippet.title,
      thumbnail: items.snippet.thumbnails.default.url,
      channel: items.snippet.channelTitle,
      viewCount: items.statistics.viewCount,
      likeCount: items.statistics.likeCount,
    }));

    const getMovieTrailePlaylist = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&type=video&relatedToVideoId=${movieTrailerVideoId}&key=${this.YOUTUBE_API_KEY}`
    );

    const movieTrailerPlaylistData = getMovieTrailePlaylist.data.items.map((items: any) => ({
      videoId: items.id.videoId,
      title: items.snippet.title,
      channel: items.snippet.channelTitle,
      thumbnail: items.snippet.thumbnails.default.url,
    }));

    return { ...movieTrailerDetailData, movieTrailerMainData, movieTrailerPlaylistData };
  };
}

export { movieService };
