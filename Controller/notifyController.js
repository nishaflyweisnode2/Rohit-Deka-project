const notify= require('../Models/notifyModel');

exports.AddNotification = async(req,res) => {
    try{
    const data = {
        message: req.body.message, 
        userId:req.user.id
    }
    const Data = await notify.create(data)
    res.status(200).json({
        message: Data
    })
    }catch(err){
        res.status(400).json({
            message: err.message
        })
    }
}


exports.GetAllNotification = async(req,res) => {
    try{
    const data = await notify.find({userId:req.user.id});
    res.status(200).json({
        message: data,
        total: data.length
    })
    }catch(err){
       res.status(400).json({
        message: err.message
       })
    }
}

exports.deleteNotification = async(req,res) => {
        try {
          const notificationId = req.params.notificationId;
      
          // Check if the notification exists
          const notification = await notify.findById(notificationId);
          if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
          }
      
          // Delete the notification
          await notify.findByIdAndDelete(notificationId);
      
          res.status(200).json({ success: true, message: 'Notification deleted successfully' });
        } catch (error) {
          console.error(error);
          res.status(500).json({ success: false, message: 'Internal server error' });
        }
      };
