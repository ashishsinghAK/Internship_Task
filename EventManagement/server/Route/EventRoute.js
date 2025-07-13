const express = require('express')
const router = express.Router();

const {verifyToken} = require("../Controller/Auth")
const {signIn,signUp} = require("../Controller/Account");

router.post("/signin",signIn);
router.post('/signup',signUp);



module.exports = router