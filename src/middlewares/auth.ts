import jwt, { JwtPayload } from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { IReqUser } from '../dto/auth.dto';
import { catchAsync } from './error';
import MyCustomError from '../utils/customError';
import { getUserRepository } from '../routes/userRouter';

import dotenv from 'dotenv';
dotenv.config();

const loginRequired = catchAsync(async (req: IReqUser, res: Response, next: NextFunction): Promise<void> => {
  const accessToken = req.headers.authorization;
  if (!process.env.JWT_SECRET_KEY) throw new MyCustomError("process.env.JWT_SECRET not defined", 500);

  if (!accessToken) {
    throw new MyCustomError("NEED_ACCESS_TOKEN", 400);
  }

  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY) as JwtPayload;
  } catch {
    throw new MyCustomError("INVALID TOKEN", 401);
  }

  const user = await getUserRepository.getUserById(decoded.id);

  if (!user) {
    throw new MyCustomError("USER_DOES_NOT_MATCH", 401);
  }

  req.user = user.id;

  next();
});

const optionalRequired = catchAsync(async (req: IReqUser , res: Response, next: NextFunction): Promise<void> => {
  const accessToken = req.headers.authorization;
  if (!process.env.JWT_SECRET_KEY) throw new MyCustomError("process.env.JWT_SECRET not defined", 500);
  let user;

  if (!accessToken) {
    user = { id: undefined};
    req.user = user.id;
  }

  if (accessToken) {
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY) as JwtPayload;
    } catch {
      throw new MyCustomError("INVALID TOKEN", 401);
    }

    user = await getUserRepository.getUserById(decoded.id);
    if (!user) {
      throw new MyCustomError("USER_DOES_NOT_MATCH", 401);
    }

    req.user = user.id;
  }

  next();
});

export {
  loginRequired,
  optionalRequired,
}