import { Prisma, PrismaClient } from '@prisma/client';
import { combinedDTO } from '../dto/movie.dto';

class InsertData {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  movieData = async (movieData: any) => {
    return await this.prisma.$transaction([
      this.prisma.movie.createMany({
        data: {
          name: movieData.name,
          english_name: movieData.english_name,
          release_date: movieData.release_data,
          director: movieData.director,
          actor: movieData.actor,
          running_time: movieData.running_time,
        },
      }),
    ]);
  };
}
export { InsertData };
