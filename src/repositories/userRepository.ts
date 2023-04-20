import { prisma } from '../repositories/prisma';
import { PrismaClient } from "@prisma/client"
import { IgetSocialUser } from "../dto/user.dto";

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
};

export {
  userRepository,
}