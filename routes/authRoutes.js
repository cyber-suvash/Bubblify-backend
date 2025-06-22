const express = require("express");
const router = express.Router();
const { verifyAuthentication } = require("../middlewares/auth-verify");

const {
  register,
  login,
  getProfile,
  Logout
} = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", verifyAuthentication, getProfile);
router.post("/logout",Logout);

module.exports = router;
