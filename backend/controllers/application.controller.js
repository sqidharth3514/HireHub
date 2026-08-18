const Application = require("../models/application.model");
const Job = require("../models/job.model");

// ==========================================
// 1. STUDENT - APPLY FOR JOB
// ==========================================

const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check whether job exists
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Check whether user already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user.userId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
      });
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      applicant: req.user.userId,
      status: "pending",
    });

    return res.status(201).json({
      message: "Job application submitted successfully",
      application,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to apply for job",
      error: error.message,
    });
  }
};

// ==========================================
// 2. STUDENT - GET MY APPLICATIONS
// ==========================================

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user.userId,
    })
      .populate(
        "job",
        "title description salary location jobType experienceLevel"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Applications fetched successfully",
      applications,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch applications",
      error: error.message,
    });
  }
};

// ==========================================
// 3. RECRUITER - GET APPLICATIONS
// ==========================================

const getRecruiterApplications = async (req, res) => {
  try {
    // Find jobs created by this recruiter
    const jobs = await Job.find({
      company: req.user.userId,
    }).select("_id");

    const jobIds = jobs.map((job) => job._id);

    // Find applications for those jobs
    const applications = await Application.find({
      job: { $in: jobIds },
    })
      .populate("job", "title location salary")
      .populate("applicant", "fullname email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Applications fetched successfully",
      applications,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch applications",
      error: error.message,
    });
  }
};

// ==========================================
// 4. RECRUITER - UPDATE APPLICATION STATUS
// ==========================================

const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!["pending", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid application status",
      });
    }

    // Find application and related job
    const application = await Application.findById(
      applicationId
    ).populate("job");

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    // Check whether recruiter owns the job
    if (
      application.job.company.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to update this application",
      });
    }

    // Update status
    application.status = status;

    await application.save();

    return res.status(200).json({
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update application status",
      error: error.message,
    });
  }
};

// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
  applyForJob,
  getMyApplications,
  getRecruiterApplications,
  updateApplicationStatus,
};