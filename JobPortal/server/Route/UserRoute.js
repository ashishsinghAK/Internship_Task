const express = require('express')
const router = express.Router();

const {signUp,signIn} = require('../Controller/Account')
const {verifyToken} = require('../Middleware/Auth')


router.post("/login",signIn)
router.post("/signup",signUp)


module.exports = router;