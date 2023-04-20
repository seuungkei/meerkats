import { CustomError } from '../middlewares/error';

class MyCustomError extends Error implements CustomError {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default MyCustomError;
