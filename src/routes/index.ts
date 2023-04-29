import * as express from 'express';
import { crawling } from './crawlerRouter';

const router = express.Router();

router.use('/movie', crawling);

export default router;