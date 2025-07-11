const express = require('express')
const router = express.Router()

const {isAdmin,verifyToken}  = require("../Middleware/Auth");
const {createJob,findJob,applyJob,withdrawApplication,listAllJob,getappliedJob} = require("../Controller/JobController")

router.post("/admin/jobs",verifyToken,isAdmin,createJob)
router.get("/get/details",findJob);
router.post("/apply",verifyToken,applyJob)
router.delete("/delete/application",verifyToken,withdrawApplication);
router.get("/get/job",listAllJob)
router.get("/getJobs",verifyToken,getappliedJob);

module.exports = router