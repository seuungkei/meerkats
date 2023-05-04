import express from 'express';

import { crawlerUtil } from '../utils/crawlerUtil';
import { crawlerController } from '../controllers/crawlerController';
import { crawlerService } from '../services/crawlerService';
import { crawlerRepository } from '../repositories/crawlerRepository';

const router = express.Router();

const getCrawlerController = new crawlerController(new crawlerService(new crawlerRepository(), new crawlerUtil()));

router.get('/bulkUpdateMovieData', getCrawlerController.bulkUpdateMovieData);

export { router as crawling };