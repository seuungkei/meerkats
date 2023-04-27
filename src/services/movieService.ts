import { MovieRepository } from '../repositories/movieRepository';
import MyCustomError from '../utils/customError';

class MovieService {
  constructor(private Repository: MovieRepository) {}

  public movieMainPage = async (skip: number, take: number) => {
    return await this.Repository.movieMainPage(skip, take);
  };
}

export { MovieService };
