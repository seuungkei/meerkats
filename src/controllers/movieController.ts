import { Request, Response } from 'express';
import { movieService } from '../services/movieService';
import { catchAsync } from '../middlewares/error';

class movieController {
  constructor(private Service: movieService) {}

  movieDetailRead = catchAsync(async (req: Request, res: Response) => {
    const { movieId } = req.params;
    console.log(movieId);
    const userId: string = req.body.userId;

    const movieDetailData = await this.Service.movieDetailRead(Number(movieId), Number(userId));
    return res.status(200).json({ movieDetailData });
  });
}

export { movieController };
