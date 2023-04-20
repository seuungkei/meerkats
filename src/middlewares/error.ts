import { Request, Response, NextFunction } from 'express';

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

const catchAsync = (func: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    func(req, res, next).catch((error: Error) => next(error));
  };
};

interface CustomError extends Error {
  statusCode?: number;
  message: string;
}

const errorMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message;
  return res.status(statusCode).json({ message });
};

export { catchAsync, errorMiddleware, CustomError };
