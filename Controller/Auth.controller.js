// controllers/Auth.controller.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import userModel from "../Model/user.model.js";

const JWT_SECRET = "your_jwt_secret_key";

export async function register(req, res) {
    const { username, email, password } = req.body;

    try {
        // Check if the username already exists
        const existingUser = await userModel.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            username,
            email,
            password: hashedPassword // Store the hashed password
        });

        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}

export async function login(req, res) {
    const { username, password } = req.body;

    try {
        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        console.log("Found user:", user); // Debug log

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log("Password valid:", isPasswordValid); // Debug log

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.log("Error in login:", error); // Debug log
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}
