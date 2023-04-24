import { Category, Movie, PrismaClient, Region } from '@prisma/client';
import MyCustomError from '../utils/customError';

interface movieDataDTO {
  category?: Category;
  region?: Region;
  release_date?: Date;
  name: string;
  director: string;
  actor: string;
  ratings: string;
  running_time: string;
}

interface movieDataWIhtLikeDTO extends movieDataDTO {
  movieLikeCount: number;
}

class movieRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  movieTraileDetail = async (movieId: number, userId: number) => {
    const movieTraileDetailData = await this.prisma.movie.findUnique({
      where: {
        id: movieId,
      },
      select: {
        category: true,
        release_date: true,
        name: true,
        director: true,
        actor: true,
        ratings: true,
        running_time: true,
        region: true,
      },
    });

    if (!movieTraileDetailData) throw new MyCustomError('zz');

    const movieTrailerLikes = await this.prisma.movieLike.count({
      where: {
        movie_id: movieId,
      },
    });

    const movieTrailerComments = await this.prisma.movieComment.findMany({
      where: {
        movie_id: movieId,
      },
      select: {
        id: true,
        content: true,
        user: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });

    const blogAboutMovieTrailers = await this.prisma.post.findMany({
      where: {
        category_id: movieTraileDetailData?.category.id,
      },
      select: {
        id: true,
        user_id: true,
        title: true,
        thumbnail: true,
        weeklyLikeCount: true,
      },
    });

    const blogLikesAndPopularitySorting = await Promise.all(
      blogAboutMovieTrailers.map(async (blog) => {
        const blogLikes = await this.prisma.postLike.count({
          where: {
            post_id: blog.id,
          },
        });
        return { ...blog, blogLikes };
      })
    );

    blogLikesAndPopularitySorting.sort((a, b) => b.weeklyLikeCount - a.weeklyLikeCount);

    return { ...movieTraileDetailData, movieTrailerLikes, movieTrailerComments, blogLikesAndPopularitySorting };
  };
}

export { movieRepository };
