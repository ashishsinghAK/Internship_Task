const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    // References
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    registeredUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    // Core Event Info
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    organiser: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        default: 0,
    },
    address: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },

    // Metadata
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Event", eventSchema);
