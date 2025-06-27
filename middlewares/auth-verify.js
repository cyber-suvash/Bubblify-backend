const jwt = require("jsonwebtoken");

const verifyAuthentication = async (req, res, next) => {
    const token = req.cookies.token;
  // const auth = req.headers["authorization"];
  //   const token = auth.split(" ")[1];
  if (!token) {
    req.user = null;
    return res.status(401).json({ msg: "Access denied no token provided" });
  }
  try {
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodeToken;
    next();
  } catch (error) {
    req.user = null;
    res.status(403).json({ msg: "invalid token" });
  }
};

module.exports = { verifyAuthentication };
// you can add any property to req, but
// avoid overwriting existing properties
// Use req.user properties for authentication.
// group custom properties under req.custom if needed.
