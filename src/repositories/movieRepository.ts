import { Prisma, PrismaClient } from '@prisma/client';
import MyCustomError from '../utils/customError';
import { LikeWithMainMovie, BestMovie, MainMovie, AllMainMovie } from '../dto/movie.dto';

class MovieRepository {
  private prisma: PrismaClient;
  private readonly MOVIE_REGION = Object.freeze({
    KOREA: 110,
  });

  constructor() {
    this.prisma = prisma;
  }

  movieMainPage = async (skip: number, take: number): Promise<AllMainMovie> => {
    const latestMovie: MainMovie[] = await this.prisma.movie.findMany({
      skip: skip,
      take: take,
      select: {
        id: true,
        name: true,
        release_date: true,
        poster_img: true,
      },
      where: {
        release_date: {
          not: null,
        },
        poster_img: {
          not: null,
        },
      },
      orderBy: {
        release_date: 'desc',
      },
    });

    const koreanMovie: MainMovie[] = await this.prisma.movie.findMany({
      skip: skip,
      take: take,
      where: {
        region_id: this.MOVIE_REGION.KOREA,
        NOT: {
          poster_img: null,
        },
      },
      select: {
        id: true,
        name: true,
        release_date: true,
        poster_img: true,
      },
    });

    const koreanMovieWithLikes: LikeWithMainMovie[] = await Promise.all(
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

    const foreignMovies: MainMovie[] = await this.prisma.movie.findMany({
      skip: skip,
      take: take,
      where: {
        NOT: {
          region_id: this.MOVIE_REGION.KOREA,
        },
        OR: {
          poster_img: { not: null },
        },
      },
      select: {
        id: true,
        name: true,
        release_date: true,
        poster_img: true,
      },
    });

    const foreignMovieWithLikes: LikeWithMainMovie[] = await Promise.all(
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

    const movieLikes = await this.prisma.movieLike.groupBy({
      by: ['movie_id'],
    });

    const bestMovie: BestMovie[] = await this.prisma.movie.findMany({
      where: {
        id: {
          in: movieLikes.map((like) => like.movie_id),
        },
      },
      select: {
        id: true,
        name: true,
        poster_img: true,
        _count: {
          select: {
            movie_likes: true,
          },
        },
      },
      orderBy: {
        movie_likes: {
          _count: 'desc',
        },
      },
    });

    return { latestMovie, koreanMovieWithLikes, foreignMovieWithLikes, bestMovie };
  };
}

export { MovieRepository };
