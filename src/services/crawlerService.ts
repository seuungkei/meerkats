import { crawlerRepository } from "../repositories/crawlerRepository"
import { crawlerUtil, Iresult } from "../utils/crawlerUtil";

interface Idata extends Iresult {
  ratingId?: number;
}

class crawlerService {
  constructor(private Repository: crawlerRepository, private Util: crawlerUtil) {
  }

  sleep = (ms: number) => {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve(ms);
      }, ms),
    );
  };

  async getMovieName(take: number, skip: number) {
    return await this.Repository.getMovieName(take, skip);
  }

  async crawler(take: number, skip: number) {
    const movieNameArr = await this.getMovieName(take, skip);

    const crawleringData = await Promise.all(movieNameArr.map(async(data) => {
      return await this.Util.crawler(data.id, data.name);
    }))

    const crawleringDataWithRatingId = await Promise.all(crawleringData.map(async(data: Idata) => {
      try {
        if (!data.ratings && !data.synopsis && !data.thumb) throw new Error(`THIS MOVIE(${data.movieName}) CANNOT SEARCH!!!`)
        if (data.ratings)
          data.ratingId = (await this.Repository.searchRatingId(data.ratings))?.id;
        return data;
      } catch (err) {
        console.log(err);
      }
    }))

    const updateMovieData = await Promise.all(crawleringDataWithRatingId.map(async(data: any) => {
      if (data) {
        // console.log("id : ", data.id, "ratingId : ", data.ratingId, "posterImg : ", data.thumb, "summary : ", data.synopsis)
        return await this.Repository.updateMovieData(data.id, data.ratingId, data.thumb, data.synopsis);
      }
    }))
    console.log(updateMovieData)
  }

  bulkUpdateMovieData = async(MAXskip: number) => {
    const take = 6;
    let skip = 0;
    while( skip < MAXskip) {
      await this.crawler(take, skip);
      await this.sleep(2000);
      skip = skip + 6;
    }
  }
}

export {
  crawlerService,
}