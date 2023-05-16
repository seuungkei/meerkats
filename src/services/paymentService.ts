import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { paymentRepository } from "../repositories/paymentRepository";
import { membershipRepository } from '../repositories/membershipRepository';
import MyCustomError from '../utils/customError';

class paymentService {
  private readonly PAYMENT_TYPES = Object.freeze({
    toss: 1,
  });
  constructor(private Repository: paymentRepository, private membershipRepository: membershipRepository) {
  }

  public async tossPayment (userId: number, membershipId: number, paymentMethodId:number, cardNumber: number, paymentOwner: string, cardExpirationYear: number, cardExpirationMonth: number, customerIdentityNumber: number, customerEmail: string) {
    const getBillingKey = await this.getBillingKey(paymentOwner, cardNumber, cardExpirationYear, cardExpirationMonth, customerIdentityNumber);

    if( !getBillingKey.customerKey || !getBillingKey.billingKey ) throw new MyCustomError(`${getBillingKey.errMessage}`, 400);
      
    const userTossInfo = {} as {
      customerKey: string;
      billingKey: string;
    };
    userTossInfo.customerKey = getBillingKey.customerKey;
    userTossInfo.billingKey = getBillingKey.billingKey;

    const membershipInfo = await this.membershipRepository.getMembershipPriceAndName(membershipId);

    if (!membershipInfo) throw new MyCustomError("wrong membershipId!!", 400)
    if (!userTossInfo) throw new MyCustomError("userTossInfo is not exist!!!", 500);

    const findSubscription = await this.Repository.findSubscription(userId);

    if (!findSubscription) {
      const orderResult = await this.orderingWithBillingKey(userTossInfo.customerKey, userTossInfo.billingKey, Number(membershipInfo.price), membershipInfo.name);

      if (!orderResult.orderId || !orderResult.orderName || !orderResult.card.amount || !orderResult.status)
        throw new MyCustomError(`${orderResult.errMessage}`, 400)

      await this.Repository.deleteTossInfo(userId);
      await this.Repository.createTossInfo(userId, userTossInfo.customerKey, userTossInfo.billingKey);

      const result = await this.Repository.inputOrder(userId, orderResult.orderId, orderResult.orderName, paymentOwner, paymentMethodId, orderResult.card.amount, orderResult.status, this.PAYMENT_TYPES.toss, customerEmail)
      const setAutopay = true;  //추후 수정필요
      if (result.status === "DONE") {
          const startDate = new Date(result.payment_date);
          const endDate = new Date(startDate.getTime());
          endDate.setDate(endDate.getDate() + 30);
          await this.Repository.inputSubscription(userId, setAutopay, membershipId, startDate, endDate);
          return "결제가 완료되었습니다.";
      }
      return `status : ${result.status}, FAILED!!`
    }

    if (findSubscription.nextmonth_membership_id !== membershipId) {
      await this.Repository.updateSubscription(findSubscription.id, membershipId)
      return "다음 달부터 변경된 멤버십을 사용하실 수 있습니다.";
    }

    return "변경된 결제 정보는 다음 달부터 적용됩니다.";
  }

  private async getBillingKey (paymentOwner: string, cardNumber: number, cardExpirationYear: number, cardExpirationMonth: number, customerIdentityNumber: number): Promise<any> {
    const customerKey = uuidv4();

    const result = await axios.post(
      "https://api.tosspayments.com/v1/billing/authorizations/card",
      {
        customerName: paymentOwner,
        cardNumber: cardNumber,
        cardExpirationYear: cardExpirationYear,
        cardExpirationMonth: cardExpirationMonth,
        customerIdentityNumber: customerIdentityNumber,
        customerKey: customerKey,
      },
      {
        headers: {
          authorization: `Basic dGVzdF9za19PeUwwcVo0RzFWT0xvYkI2S3d2cm9XYjJNUVlnOg==`,
          "Content-type": "application/json",
        },
      }
    ).then((response) => {
      const { data } = response;
      console.log("data : ",data)
      const billingKey = data.billingKey;
      return { customerKey, billingKey };
    }).catch((err) => {
      const errMessage = err.response.data.message;
      return { errMessage };
    })

    return result;
  }

  private async orderingWithBillingKey (customerKey: string, billingKey: string, amount: number, orderName: string): Promise<any> {
    const orderId = uuidv4();
    const result =  await axios.post(
      `https://api.tosspayments.com/v1/billing/${billingKey}`,
      {
        customerKey: customerKey,
        amount: amount,
        orderId: orderId,
        orderName: orderName,
      },
      {
        headers: {
          authorization: `Basic dGVzdF9za19PeUwwcVo0RzFWT0xvYkI2S3d2cm9XYjJNUVlnOg==`,
          "Content-type": "application/json",
        }
      }
    ).then((response) => {
      const { data } = response;
      return data;
    }).catch((err) => {
      const errMessage = err.response.data.message;
      return { errMessage };
    });
    
    return result;
  }
}

export {
  paymentService
}