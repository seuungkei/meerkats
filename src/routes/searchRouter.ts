import express from 'express';
import { searchController } from '../controllers/searchController';
import { searchService } from '../services/searchService';
import { searchRepository } from '../repositories/searchRepository';

const router = express.Router();

const getSearchDataController = new searchController(new searchService(new searchRepository()));

router.get('/movie', getSearchDataController.movieSearch);

export { router as searchRouter };
