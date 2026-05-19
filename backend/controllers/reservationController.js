import Reservation from "../models/Reservation.js";
import Accommodation from "../models/Accommodation.js";

const getStartOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const calculateNights = (checkIn, checkOut) => {
  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);

  const timeDifference = endDate - startDate;
  const nights = timeDifference / (1000 * 60 * 60 * 24);

  return nights;
};

// creates a new reservation
export const createReservation = async (req, res) => {
  try {
    const { accommodation, checkIn, checkOut, guests } = req.body;

    if (!accommodation || !checkIn || !checkOut || !guests) {
      res.status(400).json({
        message: "Accommodation, check-in, check-out, and guests are required",
      });
      return;
    }

    const foundAccommodation = await Accommodation.findById(accommodation);

    if (!foundAccommodation) {
      res.status(404).json({
        message: "Accommodation not found",
      });
      return;
    }

    if (foundAccommodation.owner.toString() === req.user._id.toString()) {
      res.status(400).json({
        message: "You cannot book your own accommodation",
      });
      return;
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const today = getStartOfToday();

    if (startDate < today) {
      res.status(400).json({
        message: "Check-in date cannot be in the past",
      });
      return;
    }

    if (endDate <= startDate) {
      res.status(400).json({
        message: "Check-out date must be after check-in date",
      });
      return;
    }

    const numberOfGuests = Number(guests);

    if (numberOfGuests < 1) {
      res.status(400).json({
        message: "Guests must be at least 1",
      });
      return;
    }

    if (numberOfGuests > foundAccommodation.guests) {
      res.status(400).json({
        message: `This accommodation only allows ${foundAccommodation.guests} guests`,
      });
      return;
    }

    const nights = calculateNights(checkIn, checkOut);

    if (nights <= 0) {
      res.status(400).json({
        message: "Check-out date must be after check-in date",
      });
      return;
    }

    const existingReservation = await Reservation.findOne({
      accommodation,
      status: "confirmed",
      checkIn: { $lt: endDate },
      checkOut: { $gt: startDate },
    });

    if (existingReservation) {
      res.status(400).json({
        message: "This accommodation is already booked for those dates",
      });
      return;
    }

    const nightlyTotal = nights * foundAccommodation.price;
    const cleaningFee = foundAccommodation.cleaningFee || 0;
    const serviceFee = foundAccommodation.serviceFee || 0;
    const occupancyTaxes = foundAccommodation.occupancyTaxes || 0;

    const totalPrice = nightlyTotal + cleaningFee + serviceFee + occupancyTaxes;

    const reservation = await Reservation.create({
      user: req.user._id,
      accommodation,
      checkIn,
      checkOut,
      guests: numberOfGuests,
      nights,
      nightlyTotal,
      cleaningFee,
      serviceFee,
      occupancyTaxes,
      totalPrice,
    });

    res.status(201).json({
      message: "Reservation created successfully",
      reservation,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create reservation",
      error: error.message,
    });
  }
};

// gets reservations for the logged in user
export const getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({
      user: req.user._id,
    })
      .populate("accommodation")
      .sort({ createdAt: -1 });

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch reservations",
      error: error.message,
    });
  }
};

// gets reservations for accommodations owned by the logged in user
export const getHostReservations = async (req, res) => {
  try {
    const hostAccommodations = await Accommodation.find({
      owner: req.user._id,
    }).select("_id");

    const accommodationIds = hostAccommodations.map((accommodation) => {
      return accommodation._id;
    });

    const reservations = await Reservation.find({
      accommodation: { $in: accommodationIds },
    })
      .populate("user", "name email")
      .populate("accommodation")
      .sort({ createdAt: -1 });

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch host reservations",
      error: error.message,
    });
  }
};

// cancels a reservation by the logged in user
export const cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      res.status(404).json({
        message: "Reservation not found",
      });
      return;
    }

    if (reservation.user.toString() !== req.user._id.toString()) {
      res.status(403).json({
        message: "You can only cancel your own reservations",
      });
      return;
    }

    if (reservation.status === "cancelled") {
      res.status(400).json({
        message: "Reservation is already cancelled",
      });
      return;
    }

    reservation.status = "cancelled";

    const updatedReservation = await reservation.save();

    res.status(200).json({
      message: "Reservation cancelled successfully",
      reservation: updatedReservation,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to cancel reservation",
      error: error.message,
    });
  }
};
