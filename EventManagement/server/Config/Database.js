const mongoose = require('mongoose')
require('dotenv').config()

const DBconnect = () => {
    mongoose.connect(process.env.MONGODB_URL).
    then(() => {
        console.log('Connection Established')
    }).catch((error) => {
        console.log('Connection Failed!',error.message)
        process.exit(1);
    })
}

module.exports = DBconnect;