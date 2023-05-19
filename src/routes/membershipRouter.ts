import express from 'express';
import { membershipController } from '../controllers/membershipController';
import { membershipService } from '../services/membershipService';
import { membershipRepository } from '../repositories/membershipRepository';
import { loginRequired } from '../middlewares/auth';

const router = express.Router();

const getMembershipDataController = new membershipController(new membershipService(new membershipRepository()));

router.post('', loginRequired, getMembershipDataController.thisUserMembership);
router.get('', getMembershipDataController.getmembershipInfo);

export {
  router as membershipRouter,
}