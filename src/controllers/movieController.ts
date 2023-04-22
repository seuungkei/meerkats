import { Request, Response } from 'express';
import { movieService } from '../services/movieService';
import { catchAsync } from '../middlewares/error';

class movieController {
  constructor(private Service: movieService) {}

  hi = catchAsync(async () => {});
}

export { movieController };
