const dotenv = require("dotenv");
const { verify } = require("jsonwebtoken");

dotenv.config();

const authGuard = (req, res, next) => {
  // Getting token from authourisation
  let token = req.get("authorization");
  
  if (token) {
    // Getting the main token
    token = token.split(" ")[1];
    // Verifying the token
    verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.json({
          success: 0,
          message: "Invalid token",
        });
      } else {
        next();
      }
    });
  } else {
    res.json({
      success: 0,
      message: "Access denied! unathorized user",
    });
  }
};

module.exports = authGuard;