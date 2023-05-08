import * as express from 'express';

import { blogRouter } from './blogRouter';
import { userRouter } from './userRouter';
import { movieRouter } from './movieRouter';
import { searchRouter } from './searchRouter';

const router = express.Router();

router.use("/blog", blogRouter);
router.use('/users', userRouter);
router.use('/movie', movieRouter);
router.use('/search', searchRouter);

export default router;
