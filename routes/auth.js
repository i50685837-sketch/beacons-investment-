const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        if (!fullname || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        // TODO: Save user to MongoDB

        const hashedPassword = await bcrypt.hash(password, 10);

        res.status(201).json({
            success: true,
            message: "Registration successful.",
            user: {
                fullname,
                email,
                password: hashedPassword
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        // TODO: Replace with MongoDB user lookup
        const demoUser = {
            id: "1",
            email: email,
            password: await bcrypt.hash("password123", 10)
        };

        const validPassword = await bcrypt.compare(password, demoUser.password);

        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const token = jwt.sign(
            { id: demoUser.id, email: demoUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            message: "Login successful.",
            token
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
});

// Forgot Password
router.post("/forgot-password", (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email is required."
        });
    }

    res.json({
        success: true,
        message: "Password reset link sent successfully."
    });
});

// Verify Token
router.get("/verify", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No token provided."
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        res.json({
            success: true,
            user: decoded
        });

    } catch {
        res.status(401).json({
            success: false,
            message: "Invalid token."
        });
    }
});

module.exports = router;
