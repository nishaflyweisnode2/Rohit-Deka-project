const express = require('express');
const router = express.Router();
const ShiftPreference = require('../Models/shiftModel');

// API to insert a new time slot (Admin)
exports.addshift = async (req,res) =>{
try {
    const { shift, timeOfWork, estimate,earningPerMonth } = req.body;
    // const userId = req.user.id; // Assuming you're using authentication middleware to get the user ID

    const shiftPreference = new ShiftPreference({
      // userId,
    estimate,
      shift,
      timeOfWork,
      earningPerMonth,
    });

    await shiftPreference.save();
    res.json(shiftPreference);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create shift preference' });
  }
};

exports.getshift = async (req,res) =>{
    try {
        const shiftPreferences = await ShiftPreference.find();
    res.status(200).json({ message: "shiftPreferences", status: 200, data: shiftPreferences });

        // res.json(shiftPreferences);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get shift preferences' });
      }
    };


    exports.updateshift = async (req,res) =>{
        try {
            const { shift, earningPerMonth, timeOfWork } = req.body;
            const shiftPreference = await ShiftPreference.findById(req.params.id);
        
            if (!shiftPreference) {
              return res.status(404).json({ error: 'Shift preference not found' });
            }
        
            shiftPreference.shift = shift;
            shiftPreference.earningPerMonth = earningPerMonth;
            shiftPreference.timeOfWork = timeOfWork;
        
            await shiftPreference.save();
        
            res.json(shiftPreference);
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update shift preference' });
          }
        };

        exports.deleteshift = async (req,res) =>{
        try {
            const shiftPreference = await ShiftPreference.findByIdAndDelete(req.params.id);
        
            if (!shiftPreference) {
              return res.status(404).json({ error: 'Shift preference not found' });
            }
        
            res.json({ message: 'Shift preference deleted successfully' });
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete shift preference' });
          }
        };