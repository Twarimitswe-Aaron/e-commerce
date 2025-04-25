import { body } from "express-validator";

const validateUserName = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2 }).withMessage("Name must be at least 2 characters long")
    .isLength({ max: 50 }).withMessage("Name must be at most 50 characters long")
    .matches(/^[a-zA-Z ]*$/).withMessage("Name can only contain letters and spaces"),
];

const validateUserEmail = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format"),
];

const validateUserPassword = [
  body("password")
    .trim()
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
    .matches(/\d/).withMessage("Password must contain at least one number")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[@$!%*?&#]/).withMessage("Password must contain at least one special character"),
];

export { validateUserName, validateUserEmail, validateUserPassword };