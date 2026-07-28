const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
exports.register = async (req, res) => {
    try {

        const { fullname, email, password } = req.body;

        if (!fullname || !email || !password) {
            return res.status(400).json({
                success:false,
                message:"All fields are required."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // TODO: Save user in MongoDB

        res.status(201).json({
            success:true,
            message:"User registered successfully.",
            user:{
                fullname,
                email,
                password:hashedPassword
            }
        });

    } catch(error){

        res.status(500).json({
            success:false,
            message:"Registration failed."
        });

    }
};


// Login User
exports.login = async (req,res)=>{

    try{

        const {email,password}=req.body;

        if(!email || !password){

            return res.status(400).json({
                success:false,
                message:"Email and password required."
            });

        }


        // TODO: Find user from MongoDB

        const token = jwt.sign(
            {
                email,
                role:"user"
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"7d"
            }
        );


        res.json({
            success:true,
            message:"Login successful.",
            token
        });


    }catch(error){

        res.status(500).json({
            success:false,
            message:"Login failed."
        });

    }

};


// Forgot Password
exports.forgotPassword = async(req,res)=>{

    const {email}=req.body;


    if(!email){

        return res.status(400).json({
            success:false,
            message:"Email required."
        });

    }


    res.json({
        success:true,
        message:"Password reset request received."
    });

};
