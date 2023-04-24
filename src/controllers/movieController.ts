import { Request, Response } from 'express';
import { movieService } from '../services/movieService';
import { catchAsync } from '../middlewares/error';

class movieController {
  constructor(private Service: movieService) {}

  movieTraileDetail = catchAsync(async (req: Request, res: Response) => {
    const { movieId } = req.params;
    const userId: string = req.body.userId;

    const movieTraileDetailData = await this.Service.movieTraileDetail(Number(movieId), Number(userId));
    return res.status(200).json({ movieTraileDetailData });
  });
}

export { movieController };
