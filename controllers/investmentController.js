const Investment = require("../models/Investment");


// Create Investment
exports.createInvestment = async (req, res) => {

    try {

        const { amount, plan, duration } = req.body;


        if (!amount || !plan) {
            return res.status(400).json({
                success:false,
                message:"Investment amount and plan are required."
            });
        }


        const investment = await Investment.create({

            user: req.user.id,
            amount,
            plan,
            duration: duration || "72 Hours",
            status:"Active"

        });


        res.status(201).json({

            success:true,
            message:"Investment created successfully.",
            investment

        });


    } catch(error){

        res.status(500).json({

            success:false,
            message:"Investment creation failed."

        });

    }

};



// Get Active Investments
exports.getActiveInvestments = async(req,res)=>{

    try{

        const investments = await Investment.find({

            user:req.user.id,
            status:"Active"

        });


        res.json({

            success:true,
            investments

        });


    }catch(error){

        res.status(500).json({

            success:false,
            message:"Unable to fetch investments."

        });

    }

};



// Investment History
exports.getInvestmentHistory = async(req,res)=>{

    try{

        const history = await Investment.find({

            user:req.user.id

        }).sort({

            createdAt:-1

        });


        res.json({

            success:true,
            history

        });


    }catch(error){

        res.status(500).json({

            success:false,
            message:"Unable to load history."

        });

    }

};



// Calculate Returns
exports.calculateReturns = async(req,res)=>{

    try{

        const {amount, rate} = req.body;


        const profit = amount * (rate / 100);

        const total = Number(amount) + Number(profit);


        res.json({

            success:true,
            amount,
            profit,
            totalReturn:total

        });


    }catch(error){

        res.status(500).json({

            success:false,
            message:"Calculation failed."

        });

    }

};
