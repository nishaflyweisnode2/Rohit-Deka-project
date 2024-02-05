const express = require('express');
const router = express.Router();
const PreferredTimingShift = require('../Models/timeModel');

// API to insert a new time slot (Admin)
exports.addtime = async (req,res) =>{
    try {
        const { shift, timing } = req.body;
        const preferredTimingShift = new PreferredTimingShift({ shift, timing });
        await preferredTimingShift.save();
    
        res.json(preferredTimingShift);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create preferred timing and shift' });
      }
    };

    exports.gettime = async (req,res) =>{
        try {
            const preferredTimingShifts = await PreferredTimingShift.find();
    res.status(200).json({ message: "preferredTimingShifts", status: 200, data: preferredTimingShifts });

            // res.json(preferredTimingShifts);
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to get preferred timing and shifts' });
          }
        };

        exports.updatetime = async (req,res) =>{
            try {
                const { shift, timing } = req.body;
                const preferredTimingShift = await PreferredTimingShift.findByIdAndUpdate(
                  req.params.id,
                  { shift, timing },
                  { new: true }
                );
            
                if (!preferredTimingShift) {
                  return res.status(404).json({ error: 'Preferred timing and shift not found' });
                }
            
                res.json(preferredTimingShift);
              } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Failed to update preferred timing and shift' });
              }
            };

            exports.deletetime = async (req,res) =>{
                try {
                    const preferredTimingShift = await PreferredTimingShift.findByIdAndDelete(req.params.id);
                
                    if (!preferredTimingShift) {
                      return res.status(404).json({ error: 'Preferred timing and shift not found' });
                    }
                
                    res.json({ message: 'Preferred timing and shift deleted successfully' });
                  } catch (error) {
                    console.error(error);
                    res.status(500).json({ error: 'Failed to delete preferred timing and shift' });
                  }
                };
