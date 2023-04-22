import { Request, Response } from 'express';
import { MovieService } from '../services/movieService';
import { catchAsync } from '../middlewares/error';
import MyCustomError from '../utils/customError';

class MovieController {
  constructor(private Service: MovieService) {}

  movieMainPage = catchAsync(async (req: Request, res: Response) => {
    const { skip, take } = req.query;

    if (!skip || !take) throw new MyCustomError('skip과 take를 설정해주세요', 400);

    const result = await this.Service.movieMainPage(Number(skip), Number(take));

    return res.status(200).json([result]);
  });
}

export { MovieController };
