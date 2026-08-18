const express = require("express");

const {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  getCurrentUser,
} = require("../controllers/user.controller");

const isAuthenticated = require("../middlewares/isAuthenticated");
const isAuthorized = require("../middlewares/isAuthorized");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", isAuthenticated, getProfile);

router.post("/logout", logoutUser);

router.get("/me", isAuthenticated, getCurrentUser);


module.exports = router;