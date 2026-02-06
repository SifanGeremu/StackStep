import express from 'express';
const router = express.Router();
import registerValidation from '../middleware/registerValidator.js';
import registerController from '../controller/register.controller.js';

router.post('/register',registerValidation,registerController);

export default router;

