// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

const JWT_SECRET = "your_jwt_secret_key";

export function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Access Denied. No Token Provided." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid Token" });
    }
}
