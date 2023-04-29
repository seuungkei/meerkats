import { PrismaClient } from '@prisma/client';
import express from 'express';

import { crawlerUtil } from '../utils/crawlerUtil';
import { crawlerController } from '../controllers/crawlerController';
import { crawlerService } from '../services/crawlerService';
import { crawlerRepository } from '../repositories/crawlerRepository';

const router = express.Router();

// const getCrawlerUtil = new crawlerUtil();
const getCrawlerController = new crawlerController(new crawlerService(new crawlerRepository(), new crawlerUtil()));

// router.get('/api', getCrawlerUtil.crawler);
router.get('/test', getCrawlerController.getMovieName);

export { router as crawling };