const User = require('../Model/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('dotenv').config()
const cookie = require('cookie-parser')



exports.signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body
        if (!username || !email || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }

        // check if user exist or not
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exist"
            })
        }

        const hashedPass = await bcrypt.hash(password, 10);
        // save the entry in DB

        const user = await User.create({
            username,
            email,
            password: hashedPass
        })

        return res.status(200).json({
            success: true,
            message: "Registration Done"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Registration Failed! try again"
        })
    }
}


exports.signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // check user exist ?
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not Registered"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password"
            });
        }

        const payload = {
            id: user._id,
            email: user.email,
            role: user.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });
        user.token = token
        // user.password = password;

        //create cookies
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: "Strict",
            maxAge: 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            success: true,
            message: "Login Successfull",
            user,
            token
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Login Failed. Try again"
        })
    }
}