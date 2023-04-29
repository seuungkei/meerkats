import { PrismaClient } from "@prisma/client"

class crawlerRepository {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async getMovieName(take: number, skip: number) {
    const getMovieName = await this.prisma.movie.findMany({
      take: take,
      skip: skip,
      orderBy: {
        id: 'asc'
      },
      select: {
        id: true,
        name: true,
      }
    })
    return getMovieName;
  }
}

export {
  crawlerRepository,
}