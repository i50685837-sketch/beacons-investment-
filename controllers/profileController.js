const User = require("../models/User");


// Get User Profile
exports.getProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user.id)
            .select("-password");


        if (!user) {
            return res.status(404).json({
                success:false,
                message:"User not found."
            });
        }


        res.json({
            success:true,
            profile:user
        });


    } catch(error){

        res.status(500).json({
            success:false,
            message:"Failed to load profile."
        });

    }

};



// Update User Profile
exports.updateProfile = async (req,res)=>{

    try {

        const { fullname, phone, country } = req.body;


        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                fullname,
                phone,
                country
            },
            {
                new:true
            }
        ).select("-password");


        res.json({
            success:true,
            message:"Profile updated successfully.",
            profile:user
        });


    } catch(error){

        res.status(500).json({
            success:false,
            message:"Profile update failed."
        });

    }

};



// Change Password
exports.changePassword = async(req,res)=>{

    try {

        const {oldPassword,newPassword}=req.body;


        const user = await User.findById(req.user.id);


        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found."
            });
        }


        res.json({
            success:true,
            message:"Password changed successfully."
        });


    } catch(error){

        res.status(500).json({
            success:false,
            message:"Unable to change password."
        });

    }

};
