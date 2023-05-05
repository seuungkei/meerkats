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
        name,
        english_name: {
          contains: movieTitle,
        },
      },
      select: {
        id: true,
        name: true,
        poster_img: true,
        release_date: true,
      },
      orderBy: {
        release_date: 'desc',
      },
    });
  };
}

export { SearchRepository };
