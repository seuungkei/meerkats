import { Request, Response } from 'express';
import { searchService } from "../services/searchService";
import { catchAsync } from '../middlewares/error';
import MyCustomError from '../utils/customError';
import { IreqQuery } from '../dto/search.dto';

class searchController {
  constructor (private Service: searchService) {
  }

  public blogSearch = catchAsync(async (req: Request<{}, {}, {}, IreqQuery>, res: Response) => {
    const postTitle = req.query.postTitle;

    if (!postTitle) throw new MyCustomError("postTitle not exist, FAILED", 400);

    const getBlogSearchData = await this.Service.blogSearch(postTitle);
    return res.status(200).json({ data: getBlogSearchData });
  });
}

export {
  searchController
}