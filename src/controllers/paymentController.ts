import { Request, Response } from 'express';
import { paymentService } from '../services/paymentService';
import { catchAsync } from '../middlewares/error';
import MyCustomError from '../utils/customError';
import { IReqUser } from '../dto/auth.dto';

class paymentController {
  constructor (private Service: paymentService) {
  }

  public tossPayment = catchAsync(async (req: Request & IReqUser, res: Response) => {
    const userId = req.user;
    const {membershipId, paymentMethodId, cardNumber, paymentOwner, cardExpirationYear, cardExpirationMonth, customerIdentityNumber, customerEmail} = req.body;

    if (!userId) throw new MyCustomError("userId must be defined, FAILED", 500);
    if (!membershipId || !paymentMethodId || !cardNumber || !paymentOwner || !cardExpirationYear || !cardExpirationMonth || !customerIdentityNumber || !customerEmail)
      throw new MyCustomError("something is not defined, FAILED", 400);

    const message = await this.Service.tossPayment(Number(userId), membershipId, Number(paymentMethodId), cardNumber, paymentOwner, cardExpirationYear, cardExpirationMonth, customerIdentityNumber, customerEmail);
    return res.status(201).json({ message: message });
  });
}

export {
  paymentController
}