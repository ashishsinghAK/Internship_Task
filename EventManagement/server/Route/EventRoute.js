const express = require('express')
const router = express.Router();

const {verifyToken,isAdmin} = require("../Controller/Auth")
const {signIn,signUp,createEvent,registerEvent,listAllEvents,cancelRegistration} = require("../Controller/Account");


router.post("/signin",signIn);
router.post('/signup',signUp);

router.post("/create/event",verifyToken,isAdmin,createEvent);
router.post("/event/:eventId/register",verifyToken,registerEvent);
router.get("/get/events",listAllEvents)
router.post('/cancel/:eventId/registration',verifyToken,cancelRegistration);

module.exports = router