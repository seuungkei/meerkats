import * as express from 'express';
import { blogRouter } from './blogRouter';

const router = express.Router();

router.use("/blog", blogRouter);

export default router;
