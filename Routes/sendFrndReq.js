const express = require('express');
const { userModel } = require('../models/models');
const router = express.Router()

router.get('/',async(req,res)=>{
    console.log(req.query)
    try{
        const result = await userModel.updateOne(
            { email: req.query.email },
            { $addToSet: { requests: req.query.sender } }
          );
          if(result.matchedCount > 0){
            res.sendStatus(200)
          }else {
            res.sendStatus(400)
          }
          
    }catch(err){
        res.sendStatus(400)
    }
})

module.exports = router;