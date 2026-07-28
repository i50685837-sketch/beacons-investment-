const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Verify JWT Token
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Access denied."
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
            message: "Invalid token."
        });
    }
}

// Create Investment
router.post("/create", verifyToken, async (req, res) => {

    const { amount, plan } = req.body;

    if (!amount || !plan) {
        return res.status(400).json({
            success: false,
            message: "Investment amount and plan are required."
        });
    }

    res.status(201).json({
        success: true,
        message: "Investment created successfully.",
        investment: {
            amount,
            plan,
            status: "Running",
            expectedReturn: amount * 1.5,
            duration: "72 Hours"
        }
    });

});

// Active Investments
router.get("/active", verifyToken, async (req, res) => {

    res.json({
        success: true,
        investments: [
            {
                id: 1,
                amount: 750,
                plan: "Starter",
                status: "Running",
                expectedReturn: 1125,
                duration: "72 Hours"
            }
        ]
    });

});

// Investment History
router.get("/history", verifyToken, async (req, res) => {

    res.json({
        success: true,
        history: []
    });

});

// Cancel Investment
router.delete("/cancel/:id", verifyToken, async (req, res) => {

    res.json({
        success: true,
        message: `Investment ${req.params.id} cancelled successfully.`
    });

});

module.exports = router;
