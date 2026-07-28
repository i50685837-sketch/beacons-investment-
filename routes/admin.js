const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();


// Verify Admin Token
function verifyAdmin(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success:false,
            message:"No authorization token provided."
        });
    }

    const token = authHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if(decoded.role !== "admin"){
            return res.status(403).json({
                success:false,
                message:"Admin access required."
            });
        }

        req.admin = decoded;
        next();

    } catch(error){

        return res.status(401).json({
            success:false,
            message:"Invalid token."
        });

    }
}


// Admin Dashboard
router.get("/dashboard", verifyAdmin, async(req,res)=>{

    res.json({
        success:true,
        dashboard:{
            users:0,
            totalInvestments:0,
            pendingDeposits:0,
            pendingWithdrawals:0,
            revenue:0
        }
    });

});


// View Users
router.get("/users", verifyAdmin, async(req,res)=>{

    res.json({
        success:true,
        users:[]
    });

});


// Approve Deposit
router.put("/deposit/:id/approve", verifyAdmin, async(req,res)=>{

    res.json({
        success:true,
        message:`Deposit ${req.params.id} approved`
    });

});


// Reject Deposit
router.put("/deposit/:id/reject", verifyAdmin, async(req,res)=>{

    res.json({
        success:true,
        message:`Deposit ${req.params.id} rejected`
    });

});


// Approve Withdrawal
router.put("/withdraw/:id/approve", verifyAdmin, async(req,res)=>{

    res.json({
        success:true,
        message:`Withdrawal ${req.params.id} approved`
    });

});


// Reject Withdrawal
router.put("/withdraw/:id/reject", verifyAdmin, async(req,res)=>{

    res.json({
        success:true,
        message:`Withdrawal ${req.params.id} rejected`
    });

});


module.exports = router;
