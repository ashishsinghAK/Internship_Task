const mongoose  = require('mongoose');

const jobDetail = mongoose.Schema({
    jobId:{
        type:String,
        required:true,
        unique:true
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    company:{
        type:String,
        required:true
    },
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    applicants:{
        type:Number,
        default:0
    }
})

module.exports = mongoose.model('Job',jobDetail);