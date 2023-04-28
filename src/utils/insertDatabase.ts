import { Prisma, PrismaClient } from '@prisma/client';
import { combinedDTO } from '../dto/movie.dto';

class InsertData {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  movieData = async (movieData: any) => {
    return await this.prisma.$transaction([]);
  };
}
export { InsertData };
