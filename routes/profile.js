const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Authentication middleware
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Access denied. No token provided."
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
}

// Get Profile
router.get("/", verifyToken, async (req, res) => {
    try {
        res.json({
            success: true,
            profile: {
                id: req.user.id,
                fullname: "Demo User",
                email: req.user.email,
                wallet: 0,
                invested: 0,
                profit: 0,
                referralBonus: 0,
                accountStatus: "Active",
                joined: new Date()
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
});

// Update Profile
router.put("/update", verifyToken, async (req, res) => {
    try {
        const { fullname, phone } = req.body;

        res.json({
            success: true,
            message: "Profile updated successfully.",
            profile: {
                fullname,
                phone
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Unable to update profile."
        });
    }
});

module.exports = router;
