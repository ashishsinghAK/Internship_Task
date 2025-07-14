const User = require('../Model/User')
const Event = require('../Model/Event')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()


exports.signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exist"
            })
        }

        const hashedPass = await bcrypt.hash(password, 12);
        await User.create({
            username,
            email,
            password: hashedPass
        })

        return res.status(201).json({
            success: true,
            message: "Registration Successfull"
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

        //checking user exist or not
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not Registered"
            })
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password"
            });
        }

        const payload = {
            id: user._id,
            email: user.email
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        // cookie created
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: "Strict",
            maxAge: 24 * 60 * 60 * 1000
        })

        const { password: _, ...userData } = user._doc;

        return res.status(200).json({
            success: true,
            message: "Login Successfull",
            user: userData,
            token
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Login Failed. Try again"
        })
    }
}

exports.createEvent = async (req, res) => {

    try {
        const { title, description, organiser, capacity, address, date } = req.body;
        if (!title || !description || !organiser || !capacity || !address || !date) {
            return res.status(401).json({
                success: false,
                message: "All feilds are required"
            })
        }

         // Check for duplicate event
        const existingEvent = await Event.findOne({
            title: title.trim(),
            address: address.trim(),
        });

        if (existingEvent) {
            return res.status(409).json({
                success: false,
                message: "An event with the same title, address, and date already exists"
            });
        }

        const user = req.user;
        await Event.create({
            user: user._id,
            title,
            description,
            organiser,
            capacity,
            address,
            date
        })

        return res.status(201).json({
            success: true,
            message: "Event Scheduled Successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}


exports.registerEvent = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const userId = req.user._id;

        // Search for the Event
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event Not Found"
            })
        }

        // Check for User already register
        if (event.registeredUsers.includes(userId)) {
            return res.status(400).json({
                success: false,
                message: "User already registered for this event"
            });
        }

        // Check for capacity for the Event
        if (event.registeredUsers.length >= event.capacity) {
            return res.status(400).json({
                success: false,
                message: "Event capacity is full"
            });
        }

        // If everything checks done then register the user in an event
        event.registeredUsers.push(userId);
        await event.save();

        return res.status(200).json({
            success: true,
            message: "User registered successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

exports.listAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        // If no events found
        if (events.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No events scheduled",
                events: []
            });
        }
        return res.status(200).json({
            success: true,
            events: events
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}


exports.cancelRegistration = async(req,res) => {
    try{
        const eventId = req.params.eventId;
        const userId = req.user._id;

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        if(!event.registeredUsers.includes(userId)){
            return res.status(400).json({
                success:false,
                message:"You are not Registered for this Event"
            })
        }

        // Remove user from registeredUsers
        event.registeredUsers = event.registeredUsers.filter(
            id => id.toString() !== userId.toString()
        );
        await event.save();

        return res.status(200).json({
            success:true,
            message:"Successfully unregistered from the event"
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

exports.filterEvents = async (req, res) => {
    try {
        const { date, location } = req.query;
        const query = {};

        // If date is provided, convert it to ISO and search for events on that date
        if (date) {
            const targetDate = new Date(date);
            const nextDay = new Date(targetDate);
            nextDay.setDate(targetDate.getDate() + 1);

            query.date = {
                $gte: targetDate,
                $lt: nextDay
            };
        }

        // If location is provided
        if (location) {
            query.address = { $regex: location, $options: 'i' };
        }

        const events = await Event.find(query);

        return res.status(200).json({
            success: true,
            count: events.length,
            events
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
