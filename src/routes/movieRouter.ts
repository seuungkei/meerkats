import express from 'express';

import { MovieController } from '../controllers/movieController';
import { MovieService } from '../services/movieService';
import { MovieRepository } from '../repositories/movieRepository';
import { YoutubeApi } from '../utils/youtube';
import { loginRequired } from '../middlewares/auth';

const router = express.Router();

const getMovieDataController = new MovieController(new MovieService(new MovieRepository(), new YoutubeApi()));

router.get('/main', getMovieDataController.movieMainPage);

router.get('/:movieId', loginRequired, getMovieDataController.getMovieTrailerDetail);
router.post('/:movieId/likes', loginRequired, getMovieDataController.movieLikeCreateAndDelete);

router.post('/:movieId/comments', loginRequired, getMovieDataController.createMovieComment);
router.patch('/comments/:commentId', loginRequired, getMovieDataController.updateMovieComment);
router.delete('/comments/:commentId', loginRequired, getMovieDataController.deleteMovieComment);

export { router as movieRouter };
