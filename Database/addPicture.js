const express = require('express')
const multer = require('multer');
const router = express.Router();
const path = require('path');
const { userModel} = require('../models/models');
const fs = require('fs')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Specify the destination folder for storing files
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
  });
const upload = multer({ storage: storage });
router.post('/',upload.single('file'),async(req,res)=>{
    console.log(req.body); // Access form data
    console.log(req.file);
    if(req.file){
        const fileBuffer = fs.readFileSync(req.file.path);
        console.log(fileBuffer)
        try{
            const result = await userModel.findByIdAndUpdate({_id:req.body.userId},{
                picture:`data:${req.file.mimetype};base64,${fileBuffer.toString('base64')}`
            },{new:true})
           fs.unlinkSync(req.file.path);
            console.log(result)
            res.sendStatus(200)
        }catch(err){
            fs.unlinkSync(req.file.path);
            res.sendStatus(500)
        }
    }
})

module.exports = router;