import { body } from "express-validator";

const registerValidation = [
  body("email").isEmail().withMessage("Invalid email format").normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain an uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain a lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain a number")
    .matches(/[@$!%*?&]/)
    .withMessage("Password must contain a special character"),
];

export default registerValidation;
