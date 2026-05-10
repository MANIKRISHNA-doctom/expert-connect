import express from "express";
import Booking from "../models/Booking.js";
import { getIO } from "../sockets/socket.js";

const BookingRouter = express.Router();

// POST /bookings
BookingRouter.post("/", async (req, res) => {
  try {
    const { name, email, phone, date, timeSlot, expertId } = req.body;

    // 🔒 Basic validation
    if (!name || !email || !date || !timeSlot || !expertId) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    const booking = await Booking.create(req.body);

    // ⚡ Real-time update
    const io = getIO();
    io.emit("slotBooked", {
      expertId,
      date,
      timeSlot,
    });

    res.status(201).json({
      message: "Booking successful",
      booking,
    });
  } catch (err) {
    // Prevent double booking
    if (err.code === 11000) {
      return res.status(400).json({
        message: "This slot is already booked",
      });
    }

    res.status(500).json({ message: err.message });
  }
});

// GET /bookings?email= 
BookingRouter.get("/", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const bookings = await Booking.find({email});

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//  PATCH /api/bookings/:id/status
BookingRouter.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default BookingRouter;