import * as express from 'express';
import { userRouter } from './userRouter';

const router = express.Router();

router.use('/users', userRouter);
router.use('/search', searchRouter);

export default router;
