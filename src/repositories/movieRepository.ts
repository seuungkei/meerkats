import { Category, Movie, PrismaClient, Region } from '@prisma/client';
import MyCustomError from '../utils/customError';

class MovieRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  getMovieTrailerDetail = async (movieId: number, skip: number, take: number) => {
    const movie = await this.prisma.movie.findUnique({
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

    if (!movie) throw new MyCustomError('zz');

    const movieLikesCount = await this.prisma.movieLike.count({
      where: {
        movie_id: movieId,
      },
    });

    const movieTrailerComments = await this.getMovieTrailerComments(movieId);
    const blogLists = await this.getMovieTrailerBlogList(movie?.category.id, skip, take);

    const blogLikesAndPopularitySorting = await Promise.all(
      blogLists.map(async (blog: any) => {
        const postLikes = await this.prisma.postLike.count({
          where: {
            post_id: blog.id,
          },
        });
        return { ...blog, blogLikes: postLikes };
      })
    );

    return { ...movie, movieLikesCount, movieTrailerComments, blogLikesAndPopularitySorting };
  };

  private getMovieTrailerComments = async (movieId: number) => {
    const comments = await this.prisma.movieComment.findMany({
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
    return comments;
  };

  private getMovieTrailerBlogList = async (categoryId: number, skip: number, take: number) => {
    return this.prisma.post.findMany({
      skip: skip,
      take: take,
      where: {
        category_id: categoryId,
      },
      select: {
        id: true,
        user_id: true,
        title: true,
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
  };
}

export { MovieRepository };
