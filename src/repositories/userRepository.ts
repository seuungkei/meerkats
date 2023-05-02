import { prisma } from '../repositories/prisma';
import { Prisma, PrismaClient } from '@prisma/client';
import { IgetSocialUser, userInfoDTO, userDTO } from "../dto/user.dto";

class userRepository {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async getSocialUser(socialId: string): Promise<IgetSocialUser | null> {
    const getSocialUser: IgetSocialUser | null = await this.prisma.user.findUnique({
      where: {
        social_id: socialId,
      },
      select: {
        id: true,
        nickname: true,
        email: true,
        social_id: true,
        social_type_id: true,
      },
    })

    return getSocialUser;
  };

  async createUser(nickname: string, email: string, socialId: string, socialTypeId: number): Promise<number> {
    const createUser = await this.prisma.user.create({
      data : {
        nickname: nickname,
        email: email,
        social_id: socialId,
        social_type_id: socialTypeId
      }
    })

    return createUser.id;
  };

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

export {
  userRepository,
  userInfoDTO,
}