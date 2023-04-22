import { Request, Response } from 'express';
import { movieRepository } from '../repositories/movieRepository';

class movieService {
  constructor(private Repository: movieRepository) {}
}

export { movieService };
