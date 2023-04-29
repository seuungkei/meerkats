import { Request, Response } from 'express';
import { crawlerService } from '../services/crawlerService';

class crawlerController {
  constructor (private Service: crawlerService) {
  }

  getMovieName = async(req: Request<{}, {}, {}, { take: string, skip: string }>, res: Response) => {
    const { take, skip } = req.query;
    if (!take || !skip) throw new Error("take & skip must be defined");

    const data = await this.Service.crawler(Number(take), Number(skip));
    res.status(200).json({ data: data });
  }
}

export {
  crawlerController,
}