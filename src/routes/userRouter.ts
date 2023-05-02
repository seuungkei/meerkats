import express from 'express';
import { userController } from '../controllers/userController';
import { userService } from '../services/userService';
import { userRepository } from '../repositories/userRepository';

const router = express.Router();

const getUserDataController = new userController(new userService(new userRepository()));

router.post('/kakao-login', getUserDataController.kakaoLogin);
router.post('/signup', getUserDataController.signUp);
router.post('/email-confirm', getUserDataController.confirmEmail);
router.post('/email-check', getUserDataController.checkEmail);
router.post('/email-send', getUserDataController.sendEmail);
router.post('/signin', getUserDataController.signIn);

export {
  router as userRouter,
}