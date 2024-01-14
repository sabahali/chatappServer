const express = require('express')
const router = express.Router();
const { userModel} = require('../models/models')
router.get('/',async(req,res)=>{
    console.log(req.query)
    try{
        const result = await userModel.findById(req.query.userId,'requests').populate({
            path:'requests',
            model:'users',
            select:'name _id'
        })
        res.send(result?.requests)
    }catch(err){
        res.sendStatus(500)
    }
})

module.exports = router;