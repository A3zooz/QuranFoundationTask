import express from "express";
import  {body, validationResult} from "express-validator";
import { register, login } from "../controllers/authController.js";
const router = express.Router();
import { signupValidation, loginValidation, validateLogin, validateSignup } from "../validations/authValidations.js";

router.post('/register', signupValidation, validateSignup, register);
router.post('/login', loginValidation, validateLogin, login);

export default router;
