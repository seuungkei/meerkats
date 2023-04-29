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

  async searchRatingId(rating: string) {
    return await this.prisma.rating.findFirst({
      where: {
        name : rating
      },
      select: {
        id: true
      }
    })
  }

  async updateMovieData(movieId: number, ratingId: number, posterImg: string, summary: string) {
    await this.prisma.$transaction([
      this.prisma.movie.updateMany({
        where: {
          id: movieId,
        },
        data: {
          rating_id: ratingId,
          poster_img: posterImg,
          summary: summary,
        },
      }),
    ])
    return `${movieId} update SUCCESS!!!`
  }
}

export {
  crawlerRepository,
}