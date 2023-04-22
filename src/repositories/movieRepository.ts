import { PrismaClient } from '@prisma/client';

class movieRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
}

export { movieRepository };
