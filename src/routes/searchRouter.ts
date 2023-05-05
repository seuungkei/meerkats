import express from 'express';
import { SearchController } from '../controllers/searchController';
import { SearchService } from '../services/searchService';
import { SearchRepository } from '../repositories/searchReopsitory';

const router = express.Router();

const getSearchDataController = new SearchController(new SearchService(new SearchRepository()));

router.get('/movie', getSearchDataController.movieSearch);
// router.get('/blog', getSearchDataController.blogSearch);

export { router as searchRouter };
