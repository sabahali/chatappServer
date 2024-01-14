const express = require('express')
const router = express.Router();
const {groupMsgModel} = require('../models/models')

router.get('/',async(req,res)=>{
    const {userId,groupId} = req.query
    console.log(req.query)
    try{
        const result = await groupMsgModel.find({ groupId }).sort({ date: -1 });
      res.send(result)
    }catch(err){
        res.sendStatus(500)
    }
     
})


module.exports = router;