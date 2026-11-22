const User = require("../models/User");

const zeroTrustMiddleware = async (req, res, next) => {
  try {
    // JWT middleware already verified the user
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Device verification
    if (user.deviceStatus !== "trusted") {
      return res.status(403).json({
        message: "Access denied: Untrusted device",
        accessGranted: false,
      });
    }

    // Risk verification
    if (user.riskLevel !== "low") {
      return res.status(403).json({
        message: "Access denied: High risk detected",
        accessGranted: false,
      });
    }

    // Access granted
    req.userData = user;

    next();
  } catch (error) {
    console.error("Zero Trust verification error:", error.message);

    res.status(500).json({
      message: "Zero Trust verification failed",
      accessGranted: false,
    });
  }
};

module.exports = zeroTrustMiddleware;