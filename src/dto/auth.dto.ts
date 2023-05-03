import { Request } from 'express';

interface IReqUser extends Request {
  user?: number | undefined;
}

export {
  IReqUser,
}