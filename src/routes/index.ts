import * as express from 'express';
import { movieRouter } from '../routes/movieRouter';

const router = express.Router();

router.use('/movie', movieRouter);

export default router;
