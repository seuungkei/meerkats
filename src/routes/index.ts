import * as express from 'express';

const router = express.Router();

import { movieRouter } from './movieApiRouter';

router.use('/movie', movieRouter);

export default router;
