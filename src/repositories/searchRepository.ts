import { prisma } from './prisma';
import { Prisma, PrismaClient } from '@prisma/client';
import { SearchDTO } from '../dto/search.dto';

class searchRepository {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  movieSearch = async (movieTitle: string): Promise<SearchDTO[]> => {
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
}

export { searchRepository };
