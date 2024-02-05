const aboutus = require('../Models/aboutusModel')


exports.addaboutus = async (req,res) =>{
    try{
   const aboutusData =    await aboutus.create({aboutus: req.body.aboutus});
      res.status(200).json({
        data : aboutusData,
       message: "  aboutus Added ", 
       details : aboutusData
     })
    }
    catch(err)
    {
        console.log(err);
        res.status(400).send({message: err.message})
    }
}

exports.getaboutus = async(req,res) => {
    try {
        const data = await aboutus.find();
        // console.log(data);
        res.status(200).json({
            aboutus : data
        })
        
    }catch(err)
    {
        res.status(400).send({mesage : err.mesage});
    }
}

exports.updateaboutus = async (req, res ) => {
    try {
       
        const UpdatedAboutus = await aboutus.findOneAndUpdate({_id: req.params.id}, {
            aboutus: req.body.aboutus
        }).exec();
        console.log(UpdatedAboutus);
        res.status(200).json({
            message: "aboutus Update" 
        })
        
        
    }catch(err)
    {
       console.log(err)
       res.status(401).json({
        mesage: err.mesage
       })
    }
}

exports.DeleteAboutus = async(req,res) => {
    try {
    const id = req.params.id; 
    await aboutus.deleteOne({_id: id});
    res.status(200).send({message: "about us deleted "})
    }catch(err){
      console.log(err); 
      res.status(400).send({message: err.message})
    }
}
