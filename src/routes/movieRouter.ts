import express from 'express';

import { movieController } from '../controllers/movieController';
import { movieService } from '../services/movieService';
import { movieRepository } from '../repositories/movieRepository';

const router = express.Router();

const getMovieDataController = new movieController(new movieService(new movieRepository()));

router.get('/:movieId', getMovieDataController.movieTraileDetail);

export { router as movieRouter };
