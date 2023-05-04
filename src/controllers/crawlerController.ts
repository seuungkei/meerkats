import { Request, Response } from 'express';
import { crawlerService } from '../services/crawlerService';

class crawlerController {
  constructor (private Service: crawlerService) {
  }

  bulkUpdateMovieData = async(req: Request<{}, {}, {}, { MAXskip: string }>, res: Response) => {
    const { MAXskip } = req.query;
    if (!MAXskip) throw new Error("MAXskip must be defined");

    const data = await this.Service.bulkUpdateMovieData(Number(MAXskip));
    res.status(200).json({ data: data });
  }
}

export {
  crawlerController,
}