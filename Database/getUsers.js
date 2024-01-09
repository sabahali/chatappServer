const express = require('express')
const router = express.Router();
const {userModel} = require('../models/models')
router.get('/',async(req,res)=>{
    try{
        const users = await userModel.find()
        res.send(users)
    }catch(err){
        res.sendStatus(500)
    }
    
})

router.get('/contact',async(req,res)=>{
    try{
        const user = await userModel.find({_id:req.query.userId})
        res.send(user)
    }catch(err){
        res.sendStatus(500)
    }
})

module.exports = router;