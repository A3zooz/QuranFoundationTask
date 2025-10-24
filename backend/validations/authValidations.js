import { body, validationResult } from 'express-validator';
export const signupValidation = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
]

export const loginValidation = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').exists().withMessage('Password is required')
]

export const validateSignup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

export const validateLogin = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}
