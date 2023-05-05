import { prisma } from '../repositories/prisma';
import { Prisma, PrismaClient } from '@prisma/client';

class SearchRepository {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  movieSearch = async (movieTitle: string) => {
    return await this.prisma.movie.findMany({
      where: {
        OR: [{ name: { contains: movieTitle } }, { english_name: { contains: movieTitle } }],
        NOT: {
          poster_img: null,
        },
      },
      select: {
        id: true,
        name: true,
        poster_img: true,
        release_date: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  };

  blogSearch = async (blogTitle: string) => {
    return await this.prisma.post.findMany({
      where: {
        title: {
          contains: blogTitle,
        },
      },
      select: {
        id: true,
        title: true,
        content: true,
        created_at: true,
        category_id: true,
        spoiler_info_id: true,
        user: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });
  };
}

export { SearchRepository };
