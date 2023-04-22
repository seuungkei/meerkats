import { AllMainMovie } from 'dto/movie.dto';
import { MovieRepository } from '../repositories/movieRepository';

class MovieService {
  constructor(private Repository: MovieRepository) {}

  public movieMainPage = async (skip: number, take: number): Promise<AllMainMovie> => {
    return await this.Repository.movieMainPage(skip, take);
  };
}

export { MovieService };
