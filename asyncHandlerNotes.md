##utils/ApiError.js

class ApiError extends Error {
  constructor(statusCode, message = "Something went wrong", errors = [], stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
    this.errors = errors;
    this.data = null;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };


##utils/ApiResponse.js

class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400; // true = success
  }
}

export { ApiResponse };


##middlewares/asyncHandler.js

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next))
      .catch((err) => next(err));
  };
};

export { asyncHandler };


##models/user.model.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  }

}, { timestamps: true });

export const User = mongoose.model("User", userSchema);


##controllers/auth.controller.js

import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";


// ===============================
// REGISTER CONTROLLER
// ===============================
const registerUser = asyncHandler(async (req, res) => {

  const { username, email, password } = req.body;

  // 1. Check missing fields
  if (!username || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  // 2. Check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  // 3. Create new user
  const user = await User.create({ username, email, password });

  // 4. Response
  return res
    .status(201)
    .json(new ApiResponse(201, user, "User registered successfully"));
});


// ===============================
// LOGIN CONTROLLER
// ===============================
const loginUser = asyncHandler(async (req, res) => {

  const { email, password } = req.body;

  // 1. Missing fields?
  if (!email || !password) {
    throw new ApiError(400, "Email and Password are required");
  }

  // 2. Check user exists or not
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 3. Password match
  if (user.password !== password) {
    throw new ApiError(401, "Incorrect password");
  }

  // 4. Login success
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Login successful"));
});


export { registerUser, loginUser };


##routes/auth.routes.js

import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;


##app.js ( ya server.js )

import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import { ApiError } from "./utils/ApiError.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);

// =========================
// GLOBAL ERROR HANDLER
// =========================
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
      stack: err.stack,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    stack: err.stack,
  });
});

export { app };


##Connection File: db/index.js

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected: ", conn.connection.host);
  } catch (error) {
    console.log("MongoDB connection error: ", error);
    process.exit(1);
  }
};

export default connectDB;
