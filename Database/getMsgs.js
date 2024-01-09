const express = require('express')
const router = express.Router();
const {msgModel} = require('../models/models')

router.get('/',async(req,res)=>{
    try {
        const senderId = req.query.sender;
        const receiverId = req.query.receiver;
      
        const result = await msgModel.find({
          $or: [
            { sender: senderId, receiver: receiverId },
            { sender: receiverId, receiver: senderId }
          ]
        }).sort({date:-1});
      
        // console.log(result);
        res.send(result);
      } catch (err) {
        console.error(err);
        res.sendStatus(500)
        // Handle the error
      }

})





module.exports = router;