const express = require('express');
const router = express.Router();
const TimeSlot = require('../Models/timeSlotModel');

// API to insert a new time slot (Admin)
exports.addtimeSlot = async (req,res) =>{

  const { time } = req.body;

  try {
    const newTimeSlot = new TimeSlot({ time });
    await newTimeSlot.save();
    res.json(newTimeSlot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to insert time slot.' });
  }
};


exports.gettimeSlot = async (req,res) =>{
    try {
      const availableTimeSlots = await TimeSlot.find({ isAvailable: true });
      res.json(availableTimeSlots);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch time slots.' });
    }
  };


  exports.updatetimeSlot = async (req,res) =>{
    try {
      const timeSlotId = req.params.id;
      const { time } = req.body;
  
      // Find the time slot by ID
      const timeSlot = await TimeSlot.findById(timeSlotId);
      if (!timeSlot) {
        return res.status(404).json({ error: 'Time slot not found' });
      }
  
      // Update the time slot
      timeSlot.time = time;
      await timeSlot.save();
  
      res.json(timeSlot);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update time slot' });
    }
  };
  exports.deleteTimeSlot = async (req, res) => {
    const timeSlotId = req.params.id;
  
    try {
      // Check if the time slot exists
      const timeSlot = await TimeSlot.findById(timeSlotId);
      if (!timeSlot) {
        return res.status(404).json({ error: 'Time slot not found' });
      }
  
      // Delete the time slot
      await TimeSlot.deleteOne({ _id: timeSlotId }); // or use findOneAndDelete
  
      res.json({ message: 'Time slot deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete time slot' });
    }
  };