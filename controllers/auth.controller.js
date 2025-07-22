const usermodel = require("../models/registerModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// *---------------------
// register
const register = async (req, res) => {
  try {
    const recData = req.body;
    const { fullname, email, password, role, phone } = req.body;
    console.log(recData);
    const userExists = await usermodel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: "already exits user" });
    }
    const hash_pass = await bcrypt.hash(password, 10);
    const saveuser = await usermodel.create({
      fullname,
      email,
      password: hash_pass,
      phone,
      role,
    });
    res.status(201).json({ msg: "User register successfull" });
  } catch (error) {
    res.status(500).json("Internal server error");
  }
};

// login
const isProd = process.env.NODE_ENV === "production";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await usermodel.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Invalid user , please register" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }
    const token = jwt.sign(
      {
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        _id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15h",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd, // false on localhost (HTTP)
      sameSite: isProd ? "None" : "Lax", // "Lax" works without HTTPS
      maxAge: 15 * 60 * 60 * 1000, // 15 hours
    });

    return res.status(200).json({
      access_token: token,
      user: {
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        _id: user._id,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

// profile
const getProfile = async (req, res) => {
  try {
    const userID = req.user?._id;
    if (!userID) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    const user = await usermodel.findById(userID);
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }
    res.status(200).json({
      msg: `Welcome ${user.fullname}`,
      user: {
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        _id: user._id,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// logout
const Logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "None" : "Lax",
  });

  res.status(200).json({ msg: "Logged out successfully" });
};

module.exports = { register, login, getProfile, Logout };
