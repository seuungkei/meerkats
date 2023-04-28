import { Prisma, PrismaClient } from '@prisma/client';
import { combinedDTO } from '../dto/movie.dto';

class InsertData {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  movieData = async (data: any) => {
    await this.prisma.$transaction([
      this.prisma.movie.createMany({
        data,
      }),
    ]);
  };
}
export { InsertData };
