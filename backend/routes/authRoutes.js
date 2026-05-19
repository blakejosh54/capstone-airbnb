import express from "express";
import {
  registerUser,
  loginUser,
} from "../controllers/authController.js";

const router = express.Router();

// registers a user
router.post("/register", registerUser);

// logs in a user
router.post("/login", loginUser);

export default router;