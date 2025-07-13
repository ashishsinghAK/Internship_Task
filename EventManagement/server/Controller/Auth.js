const jwt = require('jsonwebtoken')
require('dotenv').config();
const User = require('../Model/User');


exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.body.token ||
            req.header('Authorization')?.replace('Bearer ', "");

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied Token missing"
            })
        }

        // verify the obtained token
        jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: "Invalid Token"
                })
            }

            const user = await User.findById(decode.id);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "User not Found"
                })
            }
            req.user = user;
            next()
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}