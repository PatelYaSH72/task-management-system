const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // Get Token
    const token = req.headers.authorization;
    

    // Check Token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access Denied. No Token Provided",
      });
    }

    // Verify Token
    const decoded = jwt.verify(
      token.split(' ')[1],
      process.env.JWT_SECRET
    );

    // Store User Data
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

module.exports = authMiddleware;