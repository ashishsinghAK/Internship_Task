const User = require('../Model/User')
const Event = require('../Model/Event')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const cookie = require('cookie-parser')


exports.signUp = async(req,res) => {
    try{
        const {username,email,password} = req.body;
        if (!username || !email || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exist"
            })
        }

        const hashedPass = await bcrypt.hash(password,12);
        await User.create({
            username,
            email,
            password:hashedPass
        })

        return res.status(201).json({
            success:true,
            message:"Registration Successfull"
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Registration Failed! try again"
        })
    }
}


exports.signIn = async(req,res) => {
    try{
        const {email,password} = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        //checking user exist or not
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not Registered"
            })
        }

        const passwordMatch = await bcrypt.compare(password,user.password);
        if(!passwordMatch){
            return res.status(401).json({
                success: false,
                message: "Incorrect password"
            });
        }

        const payload = {
            id:user._id,
            email:user.email
        }

        const token = jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:'1d'
        });

        // cookie created
        res.cookie('token',token,{
            httpOnly: true,
            sameSite: "Strict",
            maxAge: 24 * 60 * 60 * 1000
        })

        const { password: _, ...userData } = user._doc;

        return res.status(200).json({
            success:true,
            message:"Login Successfull",
            user:userData,
            token
        })
    }catch(error){
         return res.status(500).json({
            success: false,
            message: "Login Failed. Try again"
        })
    }
}

exports.createEvent = async(req,res) => {

    try{
        const {title,description,organiser,capacity,address,date} = req.body;
        if(!title || ! description || !organiser || !capacity || !address || !date){
            return res.status(401).json({
                success:false,
                message:"All feilds are required"
            })
        }

        const user = req.user;
        await Event.create({
            user:user._id,
            title,
            description,
            organiser,
            capacity,
            address,
            date
        })

        return res.status(201).json({
            success:true,
            message:"Event Scheduled Successfully"
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:error.message
        })
    }
}


exports.registerEvent = async(req,res) => {
    try{
        
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:error.message
        })
    }
}