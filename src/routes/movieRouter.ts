import express from 'express';

import { MovieController } from '../controllers/movieController';
import { MovieService } from '../services/movieService';
import { MovieRepository } from '../repositories/movieRepository';
import { PrismaClient } from '@prisma/client';

const router = express.Router();

const getMovieDataController = new MovieController(new MovieService(new MovieRepository(new PrismaClient())));

router.get('/main', getMovieDataController.movieMainPage);

export { router as movieRouter };
