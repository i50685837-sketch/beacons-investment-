require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error(err));

// User Schema
const userSchema = new mongoose.Schema({
    fullname: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    balance: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model("User", userSchema);

// Home
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Register
app.post("/api/register", async (req, res) => {

    try {

        const { fullname, email, password } = req.body;

        const exists = await User.findOne({ email });

        if (exists)
            return res.status(400).json({
                message: "Email already exists"
            });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullname,
            email,
            password: hashedPassword
        });

        res.json({
            success: true,
            message: "Registration successful"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});

// Login
app.post("/api/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user)
            return res.status(400).json({
                message: "Invalid email or password"
            });

        const valid = await bcrypt.compare(password, user.password);

        if (!valid)
            return res.status(400).json({
                message: "Invalid email or password"
            });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            token,
            user: {
                fullname: user.fullname,
                email: user.email,
                balance: user.balance
            }
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});

// Dashboard (Protected)
app.get("/api/profile", async (req, res) => {

    const token = req.headers.authorization?.split(" ")[1];

    if (!token)
        return res.status(401).json({
            message: "Access denied"
        });

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");

        res.json(user);

    } catch {

        res.status(401).json({
            message: "Invalid token"
        });

    }

});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
