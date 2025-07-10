const mongoose = require('mongoose')

const applicationSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    job:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    appliedAt:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model('Application',applicationSchema);