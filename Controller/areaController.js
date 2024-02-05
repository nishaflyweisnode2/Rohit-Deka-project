const express = require('express');
const router = express.Router();
const PreferredArea = require('../Models/areaModel');

// API to insert a new time slot (Admin)
exports.addarea = async (req,res) =>{
    try {
        const { area, monthlyEarning } = req.body;
        const preferredArea = new PreferredArea({ area, monthlyEarning });
        await preferredArea.save();
    
        res.json(preferredArea);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create preferred area' });
      }
    };

    exports.getarea = async (req,res) =>{
    try {
      const preferredAreas = await PreferredArea.find();
      res.status(200).json({ message: "preferredAreas", status: 200, data: preferredAreas });

      // res.json(preferredAreas);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to get preferred areas' });
    }
  };


  exports.updatearea = async (req,res) =>{
  try {
    const { area, monthlyEarning } = req.body;
    const preferredArea = await PreferredArea.findByIdAndUpdate(
      req.params.id,
      { area, monthlyEarning },
      { new: true }
    );

    if (!preferredArea) {
      return res.status(404).json({ error: 'Preferred area not found' });
    }

    res.json(preferredArea);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update preferred area' });
  }
};


exports.deletearea = async (req,res) =>{
  try {
    const preferredArea = await PreferredArea.findByIdAndDelete(req.params.id);

    if (!preferredArea) {
      return res.status(404).json({ error: 'Preferred area not found' });
    }

    res.json({ message: 'Preferred area deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete preferred area' });
  }
};