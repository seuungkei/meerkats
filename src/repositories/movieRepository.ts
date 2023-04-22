import { PrismaClient } from '@prisma/client';

class movieRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  movieDetailRead = async (movieId: number, userId: number) => {
    const movieDetailData = await this.prisma.movie.findUnique({
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
    return movieDetailData;
  };
}

export { movieRepository };
