const usermodel = require("../models/registerModel");
const bcrypt = require("bcryptjs");

// *---------------------
// register
const register = async (req, res) => {
  try {
    const recData = req.body;
    const { fullname, email, password,isAdmin,phone } = req.body;
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
      isAdmin
    });
    res.status(201).json({ msg: "User register successfull" });
  } catch (error) {
    res.status(500).json("Internal server error");
  }
};

// login

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

   return res.status(200).json({
  msg: `Welcome back ${user.fullname}`,
  user: {
    fullname: user.fullname,
    email: user.email,
    isAdmin:user.isAdmin,
    _id:user._id
  },
});

  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = { register, login };
