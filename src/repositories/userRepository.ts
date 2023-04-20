import { prisma } from '../repositories/prisma';
import { Prisma, PrismaClient } from '@prisma/client';
import { userInfoDTO, userDTO } from '../dto/user.dto';

class userRepository {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  exists = async (args: Prisma.UserCountArgs) => {
    const count = await this.prisma.user.count(args);
    return Boolean(count);
  };

  checkEmail = async (email: string): Promise<Boolean> => {
    const userExists = await this.exists({
      where: {
        email: email,
      },
    });
    return userExists;
  };

  signUp = async (email: string, hashedPassword: string, nickname: string): Promise<userDTO | null> => {
    return await this.prisma.user.create({
      data: {
        nickname: nickname,
        email: email,
        password: hashedPassword,
      },
    });
  };

  getUserInfo = async (email: string): Promise<userInfoDTO | null> => {
    const userInfo: userInfoDTO | null = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });
    return userInfo;
  };
}

export { userRepository, userInfoDTO };
