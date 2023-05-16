import express from 'express';
import { paymentController } from '../controllers/paymentController';
import { paymentService } from '../services/paymentService';
import { paymentRepository } from '../repositories/paymentRepository';
import { membershipRepository } from '../repositories/membershipRepository';
import { loginRequired } from '../middlewares/auth';

const router = express.Router();

const getSearchDataController = new paymentController(new paymentService(new paymentRepository(), new membershipRepository()));

router.post('/toss', loginRequired, getSearchDataController.tossPayment);

export {
  router as paymentRouter,
}