const Transaction = require("../models/Transaction");


// Create Deposit Request
exports.deposit = async (req, res) => {

    try {

        const { amount, method } = req.body;


        if (!amount) {
            return res.status(400).json({
                success:false,
                message:"Deposit amount is required."
            });
        }


        const transaction = await Transaction.create({

            user:req.user.id,
            type:"Deposit",
            amount,
            method: method || "MPESA",
            status:"Pending"

        });


        res.status(201).json({

            success:true,
            message:"Deposit request created.",
            transaction

        });


    } catch(error){

        res.status(500).json({

            success:false,
            message:"Deposit failed."

        });

    }

};



// Create Withdrawal Request
exports.withdraw = async (req,res)=>{

    try{

        const {amount, method} = req.body;


        if(!amount){

            return res.status(400).json({

                success:false,
                message:"Withdrawal amount is required."

            });

        }


        const transaction = await Transaction.create({

            user:req.user.id,
            type:"Withdrawal",
            amount,
            method: method || "MPESA",
            status:"Pending"

        });


        res.status(201).json({

            success:true,
            message:"Withdrawal request submitted.",
            transaction

        });


    }catch(error){

        res.status(500).json({

            success:false,
            message:"Withdrawal failed."

        });

    }

};



// Get Wallet Balance
exports.getWallet = async(req,res)=>{

    try{

        const transactions = await Transaction.find({

            user:req.user.id,
            status:"Approved"

        });


        let balance = 0;


        transactions.forEach(transaction=>{

            if(transaction.type==="Deposit"){
                balance += transaction.amount;
            }

            if(transaction.type==="Withdrawal"){
                balance -= transaction.amount;
            }

        });


        res.json({

            success:true,
            wallet:{
                balance,
                currency:"KES"
            }

        });


    }catch(error){

        res.status(500).json({

            success:false,
            message:"Unable to get wallet."

        });

    }

};



// Transaction History
exports.history = async(req,res)=>{

    try{

        const transactions = await Transaction.find({

            user:req.user.id

        }).sort({

            createdAt:-1

        });


        res.json({

            success:true,
            transactions

        });


    }catch(error){

        res.status(500).json({

            success:false,
            message:"Unable to load transactions."

        });

    }

};
