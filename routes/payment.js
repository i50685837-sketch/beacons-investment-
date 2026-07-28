const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Verify JWT
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
            message: "Invalid or expired token."
        });
    }
}

// Deposit
router.post("/deposit", verifyToken, async (req, res) => {

    const { amount } = req.body;

    if (!amount || amount < 750) {
        return res.status(400).json({
            success: false,
            message: "Minimum deposit is KSh 750."
        });
    }

    res.json({
        success: true,
        message: "Deposit request received.",
        amount,
        status: "Pending"
    });

});

// Withdraw
router.post("/withdraw", verifyToken, async (req, res) => {

    const { amount } = req.body;

    if (!amount || amount < 100) {
        return res.status(400).json({
            success: false,
            message: "Minimum withdrawal is KSh 100."
        });
    }

    res.json({
        success: true,
        message: "Withdrawal request submitted.",
        amount,
        status: "Pending"
    });

});

// Wallet Balance
router.get("/wallet", verifyToken, async (req, res) => {

    res.json({
        success: true,
        wallet: {
            balance: 0,
            currency: "KES"
        }
    });

});

// Transaction History
router.get("/history", verifyToken, async (req, res) => {

    res.json({
        success: true,
        transactions: []
    });

});

module.exports = router;
