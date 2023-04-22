import * as express from 'express';
import { userRouter } from './userRouter';
import { movieRouter } from './movieRouter';

const router = express.Router();

router.use('/users', userRouter);
router.use('/movie', movieRouter);

export default router;
