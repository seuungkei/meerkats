import { PrismaClient } from '@prisma/client';
import express from 'express';
import getMovieApi from '../utils/getMovieApi';
import { InsertData } from '../utils/insertDatabase';

const router = express.Router();

const movieApiParse = new getMovieApi(new InsertData(new PrismaClient()));

router.get('/api', movieApiParse.parseMovieDataList);

export { router as movieRouter };
