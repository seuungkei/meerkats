import * as express from 'express';
import { blogRouter } from './blogRouter';
import { userRouter } from './userRouter';

const router = express.Router();

router.use("/blog", blogRouter);
router.use('/users', userRouter);

export default router;
