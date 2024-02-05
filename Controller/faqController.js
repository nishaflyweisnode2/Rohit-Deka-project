const Faq = require('../Models/faqModel')


exports.createFaq = async (req, res, next) => {
  
    const faq = await Faq.create(req.body);
  
    res.status(201).json({
      success: true,
      faq,
    });
  };




// Get All Faq (Admin)
exports.getAllFaq = async (req, res, next) => {

  
    const faqs = await Faq.find();
  
    res.status(200).json({
      success: true,
      faqs,
    });
  };

 // Update Faq -- Admin
 exports.updateFaq = async (req, res, next) => {
    let faq = await Faq.findById(req.params.id);
  
    if (!faq) {
      return next(new ErrorHander("Faq not found", 404));
    }
  
    faq = await Faq.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      faq,
    });
  };
 // Delete Faq
 exports.deleteFaq = async (req, res, next) => {
    const faq = await Faq.findById(req.params.id);
  
    if (!faq) {
      return next(new ErrorHander("Faq not found", 404));
    }
  
    await Faq.findByIdAndDelete({ _id: faq._id });
  
    res.status(200).json({
      success: true,
      message: "Faq Deleted Successfully",
    });
  };