const express = require('express')
const router = express.Router();
const {groupModel, userModel} = require('../models/models')
router.get('/',async(req,res)=>{
    try{
        const result = await userModel.findById(req.query.userId,'groups').populate({
            path:'groups',
            populate:{
                path:'members',
                model:'users',
                select:'name _id'
                
            }
        })
        res.send(result?.groups)
    }catch(err){
        res.sendStatus(500)
    }
})

module.exports = router;