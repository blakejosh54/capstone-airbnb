import jwt from "jsonwebtoken";
import User from "../models/User.js";

// checks if the user is logged in
export async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        message: "No token, access denied",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401).json({
        message: "User not found",
      });
      return;
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid token",
    });
  }
}

// checks if the user is an admin
export function adminOnly(req, res, next) {
  if (req.user.role !== "admin") {
    res.status(403).json({
      message: "Admin access only",
    });
    return;
  }

  next();
}
