import { crawlerRepository } from "../repositories/crawlerRepository"
import { crawlerUtil } from "../utils/crawlerUtil";

class crawlerService {
  constructor(private Repository: crawlerRepository, private Util: crawlerUtil) {
  }

  async getMovieName(take: number, skip: number) {
    return await this.Repository.getMovieName(take, skip);
  }

  async crawler(take: number, skip: number) {
    const movieNameArr = await this.getMovieName(take, skip);

    const result = movieNameArr.map(async(data) => {
      return await this.Util.crawler(data.name);
    })

    return result
  }
}

export {
  crawlerService,
}