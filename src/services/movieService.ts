import { movieRepository } from '../repositories/movieRepository';

class movieService {
  constructor(private Repository: movieRepository) {}

  public movieDetailRead = async (movieId: number, userId: number) => {
    return await this.Repository.movieDetailRead(movieId, userId);
  };
}

export { movieService };
