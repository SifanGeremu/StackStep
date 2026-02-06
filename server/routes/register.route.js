import express from 'express';
const router = express.Router();
import registerValidation from '../middleware/registerValidator.js';
import registerController from '../controller/register.controller.js';
import signupLimiter from '../middleware/SignupLimiter.js';

router.post('/register',signupLimiter,registerValidation,registerController);

export default router;

