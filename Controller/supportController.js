const Support = require("../Models/supportModel");
const mongoose = require("mongoose");

exports.createSupport = async (req, res) => {
    const {
        user,
        name,
        email,
        mobile,
        query
    } = req.body;
        const support = new Support({
            user: req.user.id,
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            query: req.body.query,
        });
  
        const savedSupport = await support.save(support);
        return res
          .status(200)
          .json({
            message: "support raised successfully.",
            status: 200,
            support: savedSupport,
          });
      };
   

      exports.getAllSupport = async (req, res) => {
        try {
          // Find all support
          const supports = await Support.find();
      
          res.json({
            message: 'Supports retrieved successfully',
            supports: supports
          });
        } catch (error) {
          console.error('Error retrieving supports:', error);
          res.status(500).json({ error: 'Failed to retrieve supports' });
        }
      };



      exports.replySupport = async (req, res) => {
        const { supportId } = req.params;
        const { reply } = req.body;
     
        try {
          // Find the ticket by ID
          const support = await Support.findById(supportId);
     
          // Check if the ticket exists
          if (!support) {
            return res.status(404).json({ error: 'support not found' });
          }
      
          // Add the admin reply to the ticket
          support.adminReply = reply;
          support.adminRepliedAt = Date.now();
      
          // Save the updated ticket
          const updatedSupport = await support.save();
      
          res.json({
            message: 'support replied successfully',
            support: updatedSupport
          });
        } catch (error) {
          console.error('Error replying to support:', error);
          res.status(500).json({ error: 'Failed to reply to support' });
        }
      };

      exports.deleteSupport = async (req, res) => {
        const { id } = req.params;
      
        try {
          // Find the support by ID
          const support = await Support.findById(id);
      
          // Check if the support exists
          if (!support) {
            return res.status(404).json({ error: 'support not found' });
          }
      
          // Delete the support
          await support.deleteOne();
      
          res.json({
            message: 'support deleted successfully'
          });
        } catch (error) {
          console.error('Error deleting support:', error);
          res.status(500).json({ error: 'Failed to delete support' });
        }
      };