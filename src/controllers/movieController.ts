import { Request, Response } from 'express';
import { MovieService } from '../services/movieService';
import { catchAsync } from '../middlewares/error';
import MyCustomError from '../utils/customError';

class MovieController {
  constructor(private Service: MovieService) {}

  getMovieTrailerDetail = catchAsync(async (req: Request, res: Response) => {
    const { movieId } = req.params;
    const userId: string = req.body.userId;

    // if (!movieId || !userId) {
    //   throw new MyCustomError('현재 데이터 값이 없습니다.', 400);
    // }

    const movieTrailerDetailData = await this.Service.getMovieTrailerDetail(Number(movieId), Number(userId));

    return res.status(200).json({ movieTrailerDetailData });
  });
}

export { MovieController };
