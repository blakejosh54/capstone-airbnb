import express from "express";
import {
  createReservation,
  getMyReservations,
  getHostReservations,
  cancelReservation,
} from "../controllers/reservationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createReservation);
router.get("/my-reservations", protect, getMyReservations);
router.get("/host-reservations", protect, getHostReservations);
router.put("/:id/cancel", protect, cancelReservation);

export default router;
