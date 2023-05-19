import { Request, Response } from 'express';
import { membershipService } from '../services/membershipService';
import { catchAsync } from '../middlewares/error';
import MyCustomError from '../utils/customError';
import { IReqUser } from '../dto/auth.dto';

class membershipController {
  constructor (private Service: membershipService) {
  }

  public getmembershipInfo = catchAsync(async (req: Request, res: Response) => {
    const getmembershipInfo = await this.Service.getmembershipInfo();

    return res.status(200).json({ data: getmembershipInfo });
  });

  public thisUserMembership = catchAsync(async (req: Request & IReqUser, res: Response) => {
    const userId = req.user;

    if (!userId) throw new MyCustomError("userId must be defined, FAILED", 500);

    const thisUserMembership = await this.Service.thisUserMembership(userId);

    return res.status(200).json({ thisUserMembership: thisUserMembership });
  });
}

export {
  membershipController
}