import { Request, Response } from 'express';
import { SearchService } from '../services/searchService';
import { catchAsync } from '../middlewares/error';
import MyCustomError from '../utils/customError';

class SearchController {
  constructor(private Service: SearchService) {}

  movieSearch = catchAsync(async (req: Request, res: Response) => {
    const { movieTitle } = req.body;

    const result = await this.Service.movieSearch(movieTitle);
    return res.status(200).json(result);
  });

  blogSearch = catchAsync(async (req: Request, res: Response) => {
    const { blogTitle } = req.body;

    const result = await this.Service.blogSearch(blogTitle);
    return res.status(200).json(result);
  });
}

export { SearchController };
