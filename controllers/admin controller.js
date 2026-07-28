const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Investment = require("../models/Investment");


// Admin Dashboard
exports.dashboard = async (req, res) => {

    try {

        const users = await User.countDocuments();

        const investments = await Investment.countDocuments();

        const pendingDeposits = await Transaction.countDocuments({
            type:"Deposit",
            status:"Pending"
        });

        const pendingWithdrawals = await Transaction.countDocuments({
            type:"Withdrawal",
            status:"Pending"
        });


        res.json({

            success:true,

            dashboard:{
                totalUsers:users,
                totalInvestments:investments,
                pendingDeposits,
                pendingWithdrawals
            }

        });


    } catch(error){

        res.status(500).json({
            success:false,
            message:"Unable to load dashboard."
        });

    }

};



// Get All Users
exports.getUsers = async(req,res)=>{

    try{

        const users = await User.find()
        .select("-password");


        res.json({

            success:true,
            users

        });


    }catch(error){

        res.status(500).json({

            success:false,
            message:"Unable to fetch users."

        });

    }

};



// Approve Deposit
exports.approveDeposit = async(req,res)=>{

    try{

        const transaction = await Transaction.findByIdAndUpdate(

            req.params.id,

            {
                status:"Approved"
            },

            {
                new:true
            }

        );


        res.json({

            success:true,
            message:"Deposit approved.",
            transaction

        });


    }catch(error){

        res.status(500).json({

            success:false,
            message:"Deposit approval failed."

        });

    }

};



// Reject Deposit
exports.rejectDeposit = async(req,res)=>{

    try{

        await Transaction.findByIdAndUpdate(

            req.params.id,

            {
                status:"Rejected"
            }

        );


        res.json({

            success:true,
            message:"Deposit rejected."

        });


    }catch(error){

        res.status(500).json({

            success:false,
            message:"Unable to reject deposit."

        });

    }

};



// Approve Withdrawal
exports.approveWithdrawal = async(req,res)=>{

    try{

        const transaction = await Transaction.findByIdAndUpdate(

            req.params.id,

            {
                status:"Approved"
            },

            {
                new:true
            }

        );


        res.json({

            success:true,
            message:"Withdrawal approved.",
            transaction

        });


    }catch(error){

        res.status(500).json({

            success:false,
            message:"Withdrawal approval failed."

        });

    }

};



// Reject Withdrawal
exports.rejectWithdrawal = async(req,res)=>{

    try{

        await Transaction.findByIdAndUpdate(

            req.params.id,

            {
                status:"Rejected"
            }

        );


        res.json({

            success:true,
            message:"Withdrawal rejected."

        });


    }catch(error){

        res.status(500).json({

            success:false,
            message:"Unable to reject withdrawal."

        });

    }

};
