import {Prisma, PrismaClient} from '@prisma/client'
import { prisma } from '../repositories/prisma';
import MyCustomError from '../utils/customError'
import { MovieTrailerDetail, MovieComments, Posts, MovieDetailAndMore, LikeWithMainMovie, BestMovie, MainMovie, AllMainMovie } from '../dto/movie.dto';

class MovieRepository {
  private readonly prisma: PrismaClient;
  private readonly MOVIE_REGION = Object.freeze({
    KOREA: 110,
  });

  constructor() {
    this.prisma = prisma;
  }

  getMovieTrailerDetail = async (movieId: number, userId: number): Promise<MovieTrailerDetail> => {
    const movie = await this.prisma.movie.findUnique({
      where: {
        id: movieId,
      },
      select: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        release_date: true,
        name: true,
        english_name: true,
        summary: true,
        director: true,
        actor: true,
        rating: {
          select: {
            id: true,
            name: true,
          },
        },
        running_time: true,
        region: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!movie) {
      throw new MyCustomError(`Movie with id ${movieId} not found`, 400);
    }

    const movieLikesCount: number = await this.prisma.movieLike.count({
      where: {
        movie_id: movieId,
      },
    });

    const isLikedByThisUser =
      (await this.prisma.movieLike.findFirst({
        where: {
          user_id: userId,
          movie_id: movieId,
        },
      })) !== null;
    return { ...movie, movieLikesCount, isLikedByThisUser };
  };

  public getMovieDetailAndMore = async (movieId: number, skip: number, take: number, categoryId: number): Promise<MovieDetailAndMore> => {
    const movieTrailerComments: MovieComments[] = await this.getMovieTrailerComments(movieId);
    const blogLists: Posts[] = await this.getMovieTrailerBlogList(categoryId, skip, take);

    const blogLikesAndPopularitySorting: (Posts & { blogLike: number })[] = await Promise.all(
      blogLists.map(async (blog: any) => {
        const postLikes = await this.prisma.postLike.count({
          where: {
            post_id: blog.id,
          },
        });
        return { ...blog, blogLikes: postLikes };
      })
    );

    return { movieTrailerComments, blogLikesAndPopularitySorting };
  };

  private getMovieTrailerComments = async (movieId: number): Promise<MovieComments[]> => {
    const comments = (
      await this.prisma.movieComment.findMany({
        where: {
          movie_id: movieId,
        },
        select: {
          id: true,
          content: true,
          created_at: true,
          user: {
            select: {
              id: true,
              nickname: true,
            },
          },
        },
      })
    )?.map((data) => {
      return { commentId: data.id, content: data.content, created_at: data.created_at, user: data.user };
    });
    return comments;
  };

  private getMovieTrailerBlogList = async (categoryId: number, skip: number, take: number): Promise<Posts[]> => {
    const posts = await this.prisma.post.findMany({
      skip: skip,
      take: take,
      where: {
        category_id: categoryId,
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            nickname: true,
          },
        },
        title: true,
        content: true,
        thumbnail: true,
        created_at: true,
        weeklyLikeCount: true,
      },
      orderBy: [
        {
          weeklyLikeCount: 'desc',
        },
      ],
    });

    return posts.map((post) => ({
      ...post,
      content: post.content.slice(0, 85),
    }));
  };

  public exists = async (args: Prisma.MovieLikeCountArgs): Promise<Boolean> => {
    const count = await this.prisma.movieLike.count(args);
    return Boolean(count);
  };

  public likeExists = async (userId: number, movieId: number) => {
    const likeExists = await this.exists({
      where: {
        user_id: userId,
        movie_id: movieId,
      },
    });
    return likeExists;
  };

  public createMovieLike = async (userId: number, movieId: number):Promise<string> => {
    await this.prisma.movieLike.create({
      data: {
        user_id: userId,
        movie_id: movieId,
      },
    });
    return 'createMovieLike SUCCESS';
  };

  public deleteMovieLike = async (userId: number, movieId: number):Promise<string> => {
    await this.prisma.$transaction([
      this.prisma.movieLike.deleteMany({
        where: {
          user_id: userId,
          movie_id: movieId,
        },
      }),
    ]);
    return 'deleteMovieLike SUCCESS';
  };

  public createMovieComment = async (movieId: number, content: string, userId: number) => {
    return await this.prisma.movieComment.create({
      data: {
        user_id: userId,
        movie_id: movieId,
        content: content,
      },
    });
  };

  public updateMovieComment = async (commentId: number, content: string, userId: number) => {
    return await this.prisma.movieComment.updateMany({
      where: {
        id: commentId,
        user_id: userId,
      },
      data: {
        content: content,
      },
    });
  };

  public deleteMovieComment = async (commentId: number, userId: number) => {
    return await this.prisma.movieComment.deleteMany({
      where: {
        id: commentId,
        user_id: userId,
      },
    });
  };

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
