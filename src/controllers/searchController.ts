import { Request, Response } from 'express';
import { searchService } from '../services/searchService';
import { catchAsync } from '../middlewares/error';
import MyCustomError from '../utils/customError';
import { IreqQuery } from '../dto/search.dto';

class searchController {
  constructor(private Service: searchService) {}

  movieSearch = catchAsync(async (req: Request<{}, {}, {}, IreqQuery>, res: Response) => {
    const movieTitle = req.query.movieTitle;

    if (!movieTitle) throw new MyCustomError('검색어를 입력해주세요.', 400);

    const result = await this.Service.movieSearch(movieTitle);
    return res.status(200).json({ data: result });
  });
}

export { searchController };
