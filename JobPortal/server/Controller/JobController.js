const Job = require('../Model/Job');
const User = require('../Model/User');
const Application = require("../Model/ApplicationStatus");


// This is a controller to list a job by Admin only.
exports.createJob = async (req, res) => {
    try {
        const { jobId, title, description, company } = req.body;
        if (!jobId || !title || !description || !company) {
            return res.status(400).json({
                success: false,
                message: "All feilds are necessary"
            })
        }

        // checking for duplicate job
        const existingJob = await Job.findOne({ jobId })
        if (existingJob) {
            return res.status(409).json({
                success: false,
                message: "Job with this jobId already exists",
            });
        }
        const job = await Job.create({
            jobId,
            title,
            description,
            company,
            postedBy: req.user.id
        })

        return res.status(201).json({
            success: true,
            message: "Job created successfully",
            job,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Something went wrong',
            error: error.message
        })
    }
}


// Controller to search for a particular Job using JobID
exports.findJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        if (!jobId) {
            return res.status(400).json({
                success: false,
                message: "JobId is Required"
            })
        }

        const job = await Job.findOne({ jobId });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not Exist"
            })
        }

        return res.json({
            success: true,
            job
        })
    } catch (error) {
        return res.status(500).json({
            success: true,
            error: error.message
        })
    }
}

// Apply for job

exports.applyJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        if (!jobId) {
            return res.status(400).json({
                success: false,
                message: "JobId is required"
            })
        }

        // find the user id
        const userId = req.user._id
        // console.log("User ID in applyJob:", req.user?._id);
        // console.log(userId)

        const job = await Job.findOne({ jobId });
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job Not Found"
            })
        }

        const alreadyApplied = await Application.findOne({
            user: userId,
            job: job._id
        })
        if (alreadyApplied) {
            return res.status(409).json({
                success: false,
                message: "You have already applied for this job",
            });
        }

        const application = await Application.create({
            user: userId,
            job: job._id
        })

        job.applicants += 1
        await job.save();

        return res.status(201).json({
            success: true,
            message: "Job application submitted successfully",
            application,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
}


// Withdraw Application from a Job

exports.withdrawApplication = async (req, res) => {
    try {
        const { jobId } = req.body;

        if (!jobId) {
            return res.status(400).json({
                success: false,
                message: "JobId is required"
            });
        }

        const userId = req.user._id;

        const appliedJob = await Job.findOne({ jobId });
        if (!appliedJob) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        const application = await Application.findOne({
            user: userId,
            job: appliedJob._id
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        //  Delete the application document
        await application.deleteOne();

        // Decrease applicant count and save
        appliedJob.applicants = Math.max(0, appliedJob.applicants - 1);
        await appliedJob.save();

        return res.status(200).json({
            success: true,
            message: "Application withdrawal successfull"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// List all the available jobs
exports.listAllJob = async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            totalJobs: jobs.length,
            jobs
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

//Total job Applied by an Individual

exports.getappliedJob = async (req, res) => {
    try {
        const userId = req.user._id


        const application = await Application.find({ user: userId }).populate('job');
        const appliedJob = application.map(app => app.job);

        return res.status(200).json({
            success: true,
            totalAppliedJobs: appliedJob.length,
            jobs: appliedJob
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch applied jobs",
            error: error.message
        });
    }
}
