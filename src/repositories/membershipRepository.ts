import { prisma } from '../repositories/prisma';
import { Prisma, PrismaClient } from '@prisma/client';

class membershipRepository {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async getmembershipInfo () {
    return await this.prisma.membership.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        content: true,
        ticketProvision: true,
        benefit: true
      }
    })
  } 

  async getMembershipPriceAndName (membershipId?: number) {
    return await this.prisma.membership.findFirst({
      where: {
        id: membershipId
      },
      select: {
        id: true,
        name: true,
        price: true
      }
    })
  }

  async thisUserMembership (userId: number) {
    return this.prisma.subscription.findFirst({
      where: {
        user_id: userId
      },
      select: {
        membership_id: true
      }
    })
  }
}

export {
  membershipRepository
}