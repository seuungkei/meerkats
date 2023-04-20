import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { catchAsync } from '../middlewares/error';
import MyCustomError from '../utils/customError';

class userController {
  constructor(private Service: userService) {
  }

  public kakaoLogin = catchAsync(async (req: Request, res: Response) => {
    const kakaoToken: string | undefined = req.headers.authorization;
  
    if (!kakaoToken) throw new MyCustomError("kakaoToken must be defined", 400);
  
    const { accessToken, userNickname, status } = await this.Service.kakaoLogin(kakaoToken);
  
    return res.status(status).json({ accessToken, userNickname });
  });
}

export {
  userController,
}