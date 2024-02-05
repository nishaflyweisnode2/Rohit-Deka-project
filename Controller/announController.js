const announ = require('../Models/announModel')


exports.addannoun = async (req,res) =>{
    try{
   const announData =    await announ.create({announ: req.body.announ});
      res.status(200).json({
        data : announData,
       message: "  announ Added ", 
       details : announData
     })
    }
    catch(err)
    {
        console.log(err);
        res.status(400).send({message: err.message})
    }
}

exports.getannoun = async(req,res) => {
    try {
        const data = await announ.find();
        // console.log(data);
        res.status(200).json({
            announ : data
        })
        
    }catch(err)
    {
        res.status(400).send({mesage : err.mesage});
    }
}

exports.updateannoun = async (req, res ) => {
    try {
       
        const Updatedannoun = await announ.findOneAndUpdate({_id: req.params.id}, {
            announ: req.body.announ
        }).exec();
        console.log(Updatedannoun);
        res.status(200).json({
            message: "announ Update" 
        })
        
        
    }catch(err)
    {
       console.log(err)
       res.status(401).json({
        mesage: err.mesage
       })
    }
}

exports.Deleteannoun = async(req,res) => {
    try {
    const id = req.params.id; 
    await announ.deleteOne({_id: id});
    res.status(200).send({message: "announcement deleted "})
    }catch(err){
      console.log(err); 
      res.status(400).send({message: err.message})
    }
}
