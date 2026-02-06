import express from 'express';
const router = express.Router();
import registerController from '../controller/register.controller.js';

router.post('/register', registerController);

export default router;

