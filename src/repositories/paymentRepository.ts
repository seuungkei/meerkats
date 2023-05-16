import { Decimal } from '@prisma/client/runtime';
import { prisma } from '../repositories/prisma';
import { PrismaClient } from '@prisma/client';

class paymentRepository {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async findUserTossInfo (userId: number) {
    const findUserTossInfo = await this.prisma.tossInfo.findFirst({
      where: {
        user_id : userId
      },
      select: {
        id: true,
        user_id: true,
        customerKey: true,
        billingKey: true
      },
    })

    return findUserTossInfo;
  };

  async deleteTossInfo (userId: number) {
    await this.prisma.$transaction([
      this.prisma.tossInfo.deleteMany({
        where: {
          user_id : userId
        },
      })
    ])
  }

  async createTossInfo (userId: number, customerKey: string, billingKey: string) {
    const tossInfo = await this.prisma.tossInfo.create({
      data: {
        user_id: userId,
        customerKey: customerKey,
        billingKey: billingKey
      }
    })
    return tossInfo;
  }

  async findSubscription (userId: number) {
    return this.prisma.subscription.findFirst({
      where: {
        user_id: userId
      }
    })
  };

  async inputSubscription (userId: number, setAutopay: boolean, membershipId: number, startDate: Date, endDate: Date) {
    const inputSubscription = await this.prisma.subscription.create({
      data : {
        user_id: userId,
        setAutopay: setAutopay,
        membership_id: membershipId,
        nextmonth_membership_id: membershipId,
        startdate: startDate,
        enddate: endDate
      }
    })
    return inputSubscription
  }

  async updateSubscription (subscriptionId: number, membershipId: number) {
    await this.prisma.$transaction([
      this.prisma.subscription.update({
        where: {
          id: subscriptionId
        },
        data: {
          nextmonth_membership_id: membershipId
        }
      })
    ])
  }

  async inputOrder (userId: number, orderId: string, orderName: string, paymentOwner: string, paymentMethodId: number, paymentAmount: Decimal, status: string, payment_type_id: number, customerEmail: string) {
    const result = await this.prisma.order.create({
      data : {
        user_id: userId,
        orderId: orderId,
        orderName: orderName,
        payment_owner: paymentOwner,
        customerEmail: customerEmail,
        payment_method_id: paymentMethodId,
        payment_amount: paymentAmount,
        status: status,
        payment_type_id: payment_type_id
      }
    })
    return result;
  }
}

export {
  paymentRepository
}