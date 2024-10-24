const WorkLog = require('../Models/workLogModel');

const imagePattern = "[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$";
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({ 
  cloud_name: 'dvwecihog', 
  api_key: '364881266278834', 
  api_secret: '5_okbyciVx-7qFz7oP31uOpuv7Q' 
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "images/image",
    allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"],
  },
});

const upload = multer({ storage: storage });
  
 // Helper function to get the current time in HH:mm format
const getCurrentTime = () => {
    const currentDate = new Date();
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  exports.startDuty = async (req, res) => {
    try {
      const deliveryBoyId = req.user.id;
      const { latitude, longitude } = req.body;
      upload.single("image")(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        }
  
        const fileUrl = req.file ? req.file.path : "";
        const currentDate = new Date().toISOString().split('T')[0];
        let workLog = await WorkLog.findOne({ date: currentDate, deliveryBoy: deliveryBoyId });
  
        if (!workLog) {
          workLog = new WorkLog({
            date: currentDate,
            deliveryBoy: deliveryBoyId,
            shifts: [],
            startLocation: { latitude, longitude },
            totalHoursWorked: 0,
            image: fileUrl
          });
        }
  
        const currentShift = workLog.shifts.find((shift) => !shift.endTime);
  
        if (currentShift) {
          return res.status(400).json({ message: 'Already started a shift.', status: 400 });
        }
  
        const newShift = {
          startTime: new Date(),
          endTime: undefined,
          duration: 0,
          startLocation: { latitude, longitude },
          deliveryBoy: deliveryBoyId,
        };
  
        workLog.shifts.push(newShift);
        await workLog.save();
  
        res.status(200).json({ message: 'Shift started successfully.', status: 200 });
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', status: 500, error: error.message });
    }
  };
  
// Function to calculate the distance between two points using the Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  // Haversine formula
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance.toFixed(2); // Return distance in kilometers with two decimal places
}

// Function to convert degrees to radians
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}
  exports.endDuty = async (req, res) => {
   
        try {
            const driverId = req.user.id;
          const { workLogId, latitude, longitude } = req.body;
          
          // Find the workLog and the corresponding shift
          const workLog = await WorkLog.findById(workLogId);
          if (!workLog) {
            return res.status(404).json({ message: 'Work log not found' });
          }
      
          const shift = workLog.shifts.find((shift) => !shift.endTime && shift.startTime);
          if (!shift) {
            return res.status(404).json({ message: 'Shift not found or already ended' });
          }
      

          // Update the end location in the work log
    workLog.endLocation = { latitude, longitude };
    await workLog.save();

    // Calculate the distance using the Haversine formula
    const distance = calculateDistance(
      workLog.startLocation.latitude,
      workLog.startLocation.longitude,
      latitude,
      longitude
    );

    // Update the distanceTraveled in the work log
    workLog.distanceTraveled = distance;
        //   if (shift.deliveryBoy.toString() !== deliveryBoyId) {
        //     return res.status(403).json({ message: 'You are not authorized to end this duty' });
        //   }
    //     // Check if the delivery boy is assigned to the order
    // if (shift.deliveryBoy.toString() !== driverId) {
    //     return res.status(403).json({ error: 'Not authorized to update this order' });
    //   }
    const start = new Date(shift.startTime);
    const end = new Date();
    const totalMinutes = Math.round((end - start) / 1000 / 60); // Difference in minutes
    const hours = Math.floor(totalMinutes / 60);
    // console.log(hours);
    const minutes = totalMinutes % 60;
    shift.endTime = end;
    shift.duration = {
      hours,
      minutes,
    };
 
    console.log(workLog.totalHoursWorked);
    // Save the changes
    await workLog.save();
    // console.log(shift.duration);
         // Update the WorkLog with the totalWorkDuration
    const workLogs = await WorkLog.findById(workLogId);
    // console.log(workLogs);
    // workLogs.totalHoursWorked += hours;
    workLogs.totalHoursWorked += minutes;
console.log( workLog.totalHoursWorked);
console.log (workLog.totalHoursWorked);
    // If the minutes exceed 59, adjust the hours and minutes accordingly
    if (workLog.totalHoursWorked.minutes >= 60) {
      workLog.totalHoursWorked.hours += Math.floor(workLog.totalHoursWorked.minutes / 60);
      workLog.totalHoursWorked.minutes %= 60;
    }

    // await wo rkLog.save();
      
        //   // Calculate total hours worked for the entire workLog
        //   workLog.totalHoursWorked = workLog.shifts.reduce((total, shift) => {
        //     console.log(workLog.totalHoursWorked);
            
        //     return total + (shift.duration )});
        //   }, 0) / 60; // Convert minutes to hours
      
        //   // Save the changes
        //   await workLog.save();
      
          return res.status(200).json({ message: 'Duty ended successfully', data: workLog });
        } catch (error) {
          return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
      };

      exports.getWorkLog = async (req, res) => {
            try {
              const deliveryBoyId = req.user.id; // Assuming you have the delivery boy ID from authentication
          
              // Find the work log that belongs to the delivery boy
              const workLog = await WorkLog.findOne({ deliveryBoy: deliveryBoyId }).populate('shifts');
          
              if (!workLog) {
                return res.status(404).json({ message: 'Work log not found.' });
              }
          
              return res.status(200).json({ workLog });
            } catch (error) {
              return res.status(500).json({ message: 'Error fetching work log.' });
            }
          };

          
            exports.getAllWorkLogs = async (req, res) => {
                try {
                  const allWorkLogs = await WorkLog.find().populate('shifts');
              
                  if (!allWorkLogs || allWorkLogs.length === 0) {
                    return res.status(404).json({ message: 'No work logs found.' });
                  }
              
                  return res.status(200).json({ workLogs: allWorkLogs });
                } catch (error) {
                  return res.status(500).json({ message: 'Error fetching work logs.' });
                }
              };

           
                exports.getWorkLogsByDeliveryBoyId = async (req, res) => {
                    try {
                      const deliveryBoyId = req.params.deliveryBoyId;
                      const workLogs = await WorkLog.find({ deliveryBoy: deliveryBoyId }).populate('shifts');
                  
                      return res.status(200).json({ workLogs });
                    } catch (error) {
                      return res.status(500).json({ message: 'Error fetching work logs.' });
                    }
                  };
