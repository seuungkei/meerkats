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
        name: movieTitle,
      },
    });
  };
}

export { SearchRepository };
