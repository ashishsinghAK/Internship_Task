const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const DBconnect = require('./Config/Database');
const PORT = 5000

const userRoute = require("./Route/UserRoute");
const jobRoute = require("./Route/JobRoute")

const app = express();
require('dotenv').config();
app.use(express.json());
app.use(cookieParser());


app.use(cors({
    origin: '*',
    credentials: true
}))

//routes
app.use("/api/auth",userRoute);
app.use("/api",jobRoute)


DBconnect();
app.listen(PORT, () => {
    console.log(`Server is listening at ${PORT} Port`)
})