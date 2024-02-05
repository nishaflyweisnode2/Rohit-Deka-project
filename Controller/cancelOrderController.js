const RejectionReason = require('../Models/cancelOrder');

exports.AddcancelOrder = async (req, res) => {
    const { reason } = req.body;
  
    try {
      const newRejectionReason = await RejectionReason.create({ reason });
      res.status(201).json({ status: 'success', data: newRejectionReason });
    } catch (err) {
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  };

  exports.getRejectionReasons = async (req, res) => {
    try {
      const rejectionReasons = await RejectionReason.find();
      res.json({ status: 'success', data: rejectionReasons });
    } catch (err) {
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  };

  exports.updateRejectionReason = async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
  
    try {
      const updatedRejectionReason = await RejectionReason.findByIdAndUpdate(id, { reason }, { new: true });
  
      if (!updatedRejectionReason) {
        return res.status(404).json({ status: 'error', message: 'Rejection reason not found' });
      }
  
      res.status(200).json({ status: 'success', data: updatedRejectionReason });
    } catch (err) {
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  };

  exports.deleteRejectionReason = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedRejectionReason = await RejectionReason.findByIdAndDelete(id);
  
      if (!deletedRejectionReason) {
        return res.status(404).json({ status: 'error', message: 'Rejection reason not found' });
      }
  
      res.status(200).json({ status: 'success', message: 'Rejection reason deleted successfully' });
    } catch (err) {
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  };