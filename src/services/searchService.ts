import { SearchRepository } from '../repositories/searchReopsitory';
import MyCustomError from '../utils/customError';

class SearchService {
  constructor(private Repository: SearchRepository) {}

  movieSearch = async (movieTitle: string) => {
    return await this.Repository.movieSearch(movieTitle);
  };
}

export { SearchService };
