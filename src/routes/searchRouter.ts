import express from 'express';
import { searchController } from '../controllers/searchController';
import { searchService } from '../services/searchService';
import { searchRepository } from '../repositories/searchRepository';
import { blogRepository } from '../repositories/blogRepository';

const router = express.Router();

const getSearchDataController = new searchController(new searchService(new searchRepository(new blogRepository())));

router.get('/blog', getSearchDataController.blogSearch);

export {
  router as searchRouter,
}