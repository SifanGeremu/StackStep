import express from "express";
import { validationResult } from "express-validator";
import registerValidation from "../middleware/registerValidator.js";
import registerController from "../controller/register.controller.js";
import signupLimiter from "../middleware/SignupLimiter.js";

const router = express.Router();

router.post("/", signupLimiter, registerValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;
    return res.status(400).json({ errors: [firstError] });
  }

  return registerController(req, res);
});

export default router;
