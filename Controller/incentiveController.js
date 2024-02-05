const DailyIncentive = require("../Models/incentiveModel");

exports.addincentive = async (req, res) => {
  try {
    const { perOrderEarning, orderIncentives, rainBonus, peakHourBonus } =
      req.body;
    const dailyIncentive = await DailyIncentive.create({
      perOrderEarning,
      orderIncentives,
      rainBonus,
      peakHourBonus,
    });
    res.status(201).json({ success: true, data: dailyIncentive });
  } catch (error) {
    console.error("Error creating Daily Incentive:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to create Daily Incentive" });
  }
};

exports.getincentive = async (req, res) => {
  try {
    const dailyIncentives = await DailyIncentive.find();
    res.status(200).json({ success: true, data: dailyIncentives });
  } catch (error) {
    console.error("Error getting Daily Incentives:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to get Daily Incentives" });
  }
};
exports.updateincentive = async (req, res) => {
    try {
        const { perOrderEarning, orderIncentives, rainBonus, peakHourBonus } = req.body;
        const updatedDailyIncentive = await DailyIncentive.findByIdAndUpdate(
          req.params.id,
          { perOrderEarning, orderIncentives, rainBonus, peakHourBonus },
          { new: true }
        );
        if (!updatedDailyIncentive) {
          return res.status(404).json({ success: false, error: 'Daily Incentive not found' });
        }
        res.status(200).json({ success: true, data: updatedDailyIncentive });
      } catch (error) {
        console.error('Error updating Daily Incentive:', error);
        res.status(500).json({ success: false, error: 'Failed to update Daily Incentive' });
      }
    };
    
exports.Deleteincentive = async (req, res) => {
    try {
        const deletedDailyIncentive = await DailyIncentive.findByIdAndDelete(req.params.id);
        if (!deletedDailyIncentive) {
          return res.status(404).json({ success: false, error: 'Daily Incentive not found' });
        }
        res.status(200).json({ success: true, data: deletedDailyIncentive });
      } catch (error) {
        console.error('Error deleting Daily Incentive:', error);
        res.status(500).json({ success: false, error: 'Failed to delete Daily Incentive' });
      }
    };
