import * as express from 'express';

import { blogRouter } from './blogRouter';
import { userRouter } from './userRouter';
import { movieRouter } from './movieRouter';

const router = express.Router();

router.use("/blog", blogRouter);
router.use('/users', userRouter)
router.use('/movie', movieRouter);

export default router;
