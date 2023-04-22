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

  movieDetailRead = async (movieId: number, userId: number) => {
    const movieDetailData = await this.prisma.movie.findUnique({
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

    if (!movieDetailData) throw new MyCustomError('zz');

    const movieLikeCount = await this.prisma.movieLike.count({
      where: {
        movie_id: movieId,
      },
    });

    const movieComment = await this.prisma.movieComment.findMany({
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

    const movieblog = await this.prisma.post.findMany({
      where: {
        category_id: movieDetailData?.category.id,
      },
      select: {
        id: true,
        user_id: true,
        title: true,
        thumbnail: true,
      },
    });

    return { ...movieDetailData, movieLikeCount, movieComment };
  };
}

export { movieRepository };
