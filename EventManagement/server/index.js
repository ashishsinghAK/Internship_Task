const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const DBconnect = require('./Config/Database')
const PORT = 5000
const EventRoute = require('./Route/EventRoute')


const app = express();
app.use(express.json());
app.use(cookieParser());


app.use(cors({
    origin:'*',
    credentials:true
}))

//Route
app.use("/api",EventRoute);

DBconnect();
app.listen(PORT,() => {
    console.log(`Server is listening on ${PORT} Port`)
})