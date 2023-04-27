import { Prisma, PrismaClient } from '@prisma/client';
import MyCustomError from '../utils/customError';

class MovieRepository {
  private prisma: PrismaClient;
  private readonly MOVIE_REGION = Object.freeze({
    KOREA: 1,
  });

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  movieMainPage = async (skip: number, take: number) => {
    const latestMovie = await this.prisma.movie.findMany({
      skip: skip,
      take: take,
      select: {
        id: true,
        name: true,
        release_date: true,
        poster_img: true,
      },
      orderBy: {
        release_date: 'desc',
      },
    });

    const koreanMovie = await this.prisma.movie.findMany({
      skip: skip,
      take: take,
      where: {
        region_id: this.MOVIE_REGION.KOREA,
      },
      select: {
        id: true,
        name: true,
        release_date: true,
        poster_img: true,
      },
    });

    const koreanMovieWithLikes = await Promise.all(
      koreanMovie.map(async (movie) => {
        const likes = await this.prisma.movieLike.count({
          where: {
            movie_id: movie.id,
          },
        });
        return { ...movie, likes };
      })
    );
    koreanMovieWithLikes.sort((a, b) => b.likes - a.likes);

    const foreignMovies = await this.prisma.movie.findMany({
      skip: skip,
      take: take,
      where: {
        NOT: {
          region_id: this.MOVIE_REGION.KOREA,
        },
      },
      select: {
        id: true,
        name: true,
        release_date: true,
        poster_img: true,
      },
    });

    const foreignMovieWithLikes = await Promise.all(
      foreignMovies.map(async (movie) => {
        const likes = await this.prisma.movieLike.count({
          where: {
            movie_id: movie.id,
          },
        });
        return { ...movie, likes };
      })
    );
    foreignMovieWithLikes.sort((a, b) => b.likes - a.likes);
    return { latestMovie, koreanMovieWithLikes, foreignMovieWithLikes };
  };
}

export { MovieRepository };
