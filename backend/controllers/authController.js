import { hashPassword, comparePassword, generateToken, verifyToken } from "../utils/authUtils.js";
import {db} from "../config/db.js";

export const register = async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await hashPassword(password);
        db.run(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            [email, hashedPassword],
            async function (err) {
                if (err && err.message.includes("UNIQUE constraint failed")) {
                    return res.status(409).json({ message: "Email already registered" });
                }
                else if (err) {
                    return res.status(400).json({ message: "Registration failed", error: err.message });
                }
                return res.status(201).json({ message: "User registered successfully" });
            }
        )
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export const login = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    db.get(
        'SELECT * FROM users WHERE email = ?',
        [email], async (err, user) => {
            if (err) {
                return res.status(500).json({ message: "Internal server error", error: err.message });
            }
            if (!user) {
                return res.status(401).json({ message: "Invalid email or password" });
            }
            const isMatch = await comparePassword(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid email or password" });
            }
            const token = generateToken(user);
            return res.status(200).json({ message: "Login successful", token, user: {
                email: user.email,
                id: user.id
            } });
        })

}