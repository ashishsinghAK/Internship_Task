const jwt = require('jsonwebtoken');
require('dotenv').config()
const User = require("../Model/User")


exports.verifyToken = async(req,res,next) => {
    try{
        // extract token
        const token = req.cookies.token || req.body.token ||
        req.header('Authorization')?.replace('Bearer ', "");

        if(!token){
            return res.status(401).json({
                success:false,
                message:"Access denied, Token missing"
            })
        }

        // verifying token
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: "Invalid or Expired Token"
                });
            }

            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "User not found"
                });
            }

            req.user = user; 
            next();
        });
       
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message || "Internal server error"
        })
    }
}


exports.isUser = (req,res,next) => {
    try{
        if(req.user?.role !== 'user'){
            return res.status(403).json({
                success:false,
                message:"Permission denied: User access only"
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Verification Failed"
        })
    }
}


exports.isAdmin = (req,res,next) => {
    try{
        if(req.user?.role !== 'admin'){
            return res.status(401).json({
                success:false,
                message:"Permission denied, Admin access only"
            })
        }
        next()
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Verification Failed"
        })
    }
}