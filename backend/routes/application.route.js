const express = require("express");

const {
  applyForJob,
  getMyApplications,
  getRecruiterApplications,
  updateApplicationStatus,
} = require("../controllers/application.controller");

const isAuthenticated = require("../middlewares/isAuthenticated");
const isAuthorized = require("../middlewares/isAuthorized");

const router = express.Router();

router.post(
  "/apply/:jobId",
  isAuthenticated,
  isAuthorized("student"),
  applyForJob
);

router.get(
  "/my-applications",
  isAuthenticated,
  isAuthorized("student"),
  getMyApplications
);

router.get(
  "/recruiter",
  isAuthenticated,
  isAuthorized("recruiter"),
  getRecruiterApplications
);

router.put(
  "/:applicationId/status",
  isAuthenticated,
  isAuthorized("recruiter"),
  updateApplicationStatus
);

module.exports = router;