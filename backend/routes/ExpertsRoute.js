import express from "express";
import Expert from "../models/Expert.js";
import Booking from "../models/Booking.js";

const Expertrouter = express.Router();


Expertrouter.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", category } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);

    const query = {
      name: { $regex: search, $options: "i" },
    };

    if (category) {
      query.category = category;
    }

    const experts = await Expert.find(query)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const total = await Expert.countDocuments(query);

    res.json({ experts, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


Expertrouter.get("/:id/slots", async (req, res) => {
  try {
    const { date } = req.query;
    if(!date){
      return res.status(400).json({message : "date is missing"})
    }

    const allSlots = [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "2:00 PM",
      "3:00 PM",
    ];

    const booked = await Booking.find({
      expertId: req.params.id,
      date,
    });
    console.log(booked);
    const bookedSlots = booked.map((b) => b.timeSlot);

    const availableSlots = allSlots.filter(
      (slot) => !bookedSlots.includes(slot)
    );

    res.json({
      date,
      availableSlots,
      bookedSlots,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


Expertrouter.get("/:id", async (req, res) => {
  try {
    
    const expert = await Expert.findById(req.params.id);

    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }
    res.json(expert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


Expertrouter.post("/", async (req, res) => {
  try {
    const data = req.body;


    if (Array.isArray(data)) {
      // Validate each item
      for (let item of data) {
        if (!item.name || !item.category || !item.experience) {
          return res.status(400).json({
            message: "Each expert must have name, category, and experience",
          });
        }
      }

      const experts = await Expert.insertMany(data);

      return res.status(201).json({
        message: "Experts created successfully",
        experts,
      });
    } else {
      // Single expert
      const { name, category, experience, rating } = data;

      if (!name || !category || !experience) {
        return res.status(400).json({
          message: "Name, category, and experience are required",
        });
      }

      const expert = await Expert.create({
        name,
        category,
        experience,
        rating,
      });

      return res.status(201).json({
        message: "Expert created successfully",
        expert,
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default Expertrouter;