const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const User = require("./models/User");
const authMiddleware = require("./middleware/authMiddleware");
const zeroTrustMiddleware = require("./middleware/zeroTrustMiddleware");

// Local development can use backend/.env. On Vercel, secrets are supplied
// through Project Settings -> Environment Variables.
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();

// ===============================
// Middleware
// ===============================
app.use(cors());
app.use(express.json());

// ===============================
// Serverless-safe MongoDB connection
// ===============================
// Reuse the connection between warm Vercel Function invocations.
const mongooseCache = global.__zeroTrustMongooseCache || {
  connection: null,
  promise: null,
};
global.__zeroTrustMongooseCache = mongooseCache;

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI environment variable is not configured");
  }

  if (!mongooseCache.promise) {
    mongooseCache.promise = mongoose
      .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
      })
      .then((connection) => {
        mongooseCache.connection = connection;
        return connection;
      })
      .catch((error) => {
        mongooseCache.promise = null;
        mongooseCache.connection = null;
        throw error;
      });
  }

  await mongooseCache.promise;
  return mongooseCache.connection;
}

// Ensure the database is ready before any existing /api route runs.
app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    return res.status(503).json({
      message: "Database unavailable. Check the MONGO_URI deployment environment variable.",
    });
  }
});

// ===============================
// Test Route
// ===============================
app.get("/", (req, res) => {
  res.send("Zero Trust Student Portal Backend is running!");
});

// ===============================
// Create Student
// ===============================
app.post("/api/users", async (req, res) => {
  try {
    const {
      studentId,
      name,
      email,
      password,
      role,
      deviceStatus,
      riskLevel,
    } = req.body;

    if (!studentId || !name || !email || !password) {
      return res.status(400).json({
        message: "Student ID, name, email and password are required",
      });
    }

    // Check whether student already exists
    const existingUser = await User.findOne({
      $or: [{ studentId }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Student ID or email already exists",
      });
    }

    // bcryptjs uses the bcrypt hash format, so existing bcrypt hashes remain compatible.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create student
    const user = new User({
      studentId,
      name,
      email,
      password: hashedPassword,
      role: role || "student",
      deviceStatus: deviceStatus || "trusted",
      riskLevel: riskLevel || "low",
    });

    const savedUser = await user.save();

    // Never return password
    res.status(201).json({
      message: "Student created successfully",
      user: {
        studentId: savedUser.studentId,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        deviceStatus: savedUser.deviceStatus,
        riskLevel: savedUser.riskLevel,
      },
    });
  } catch (error) {
    console.error("Create student error:", error.message);

    res.status(500).json({
      message: "Failed to create student",
      error: error.message,
    });
  }
});

// ===============================
// Student Login
// ===============================
app.post("/api/login", async (req, res) => {
  try {
    const { studentId, password } = req.body;

    if (!studentId || !password) {
      return res.status(400).json({
        message: "Student ID and password are required",
      });
    }

    // Find student
    const user = await User.findOne({ studentId });

    if (!user) {
      return res.status(401).json({
        message: "Invalid student ID or password",
      });
    }

    // Compare password with hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid student ID or password",
      });
    }

    // Create JWT token
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable is not configured");
    }

    const token = jwt.sign(
      {
        userId: user._id,
        studentId: user.studentId,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        studentId: user.studentId,
        name: user.name,
        email: user.email,
        role: user.role,
        deviceStatus: user.deviceStatus,
        riskLevel: user.riskLevel,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
});

// ===============================
// Zero Trust Protected Profile
// ===============================
app.get(
  "/api/profile",
  authMiddleware,
  zeroTrustMiddleware,
  async (req, res) => {
    try {
      const user = await User.findById(req.user.userId).select("-password");

      if (!user) {
        return res.status(404).json({
          message: "Student not found",
        });
      }

      res.status(200).json({
        message: "Zero Trust access granted",
        accessGranted: true,
        user: user,
      });
    } catch (error) {
      console.error("Profile error:", error.message);

      res.status(500).json({
        message: "Failed to fetch profile",
        error: error.message,
      });
    }
  }
);

// ===============================
// Local development server
// ===============================
// Vercel imports this app through the root server.js wrapper and runs it as
// a serverless Express Function; it must not open its own listening socket.
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
