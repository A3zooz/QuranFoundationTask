import { verifyToken } from "../utils/authUtils.js";

export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization header missing or malformed" });
    }
    const token = authHeader.split(" ")[1];
    console.log(authHeader);
    const decoded = verifyToken(token);
    console.log(decoded)
    if (!decoded) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
    req.user = decoded;
    next();
}