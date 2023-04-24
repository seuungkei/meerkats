import { movieRepository } from '../repositories/movieRepository';

class movieService {
  constructor(private Repository: movieRepository) {}

  public movieTraileDetail = async (movieId: number, userId: number) => {
    return await this.Repository.movieTraileDetail(movieId, userId);
  };
}

export { movieService };
