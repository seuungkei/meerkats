import * as express from 'express';

import { blogRouter } from './blogRouter';
import { userRouter } from './userRouter';
import { movieRouter } from './movieRouter';
import { searchRouter } from './searchRouter';
import { membershipRouter } from './membershipRouter';

const router = express.Router();

router.use("/blog", blogRouter);
router.use('/users', userRouter);
router.use('/movie', movieRouter);
router.use('/search', searchRouter);
router.use('/membership', membershipRouter)

export default router;
