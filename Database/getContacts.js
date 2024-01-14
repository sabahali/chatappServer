const express = require('express')
const router = express.Router();
const { userModel} = require('../models/models')
router.get('/',async(req,res)=>{
    console.log(req.query)
    try{
        const result = await userModel.findById(req.query.userId,'contacts').populate({
            path:'contacts',
            model:'users',
            select:'name _id picture'
        })
        // console.log(result)
        res.send(result?.contacts)
    }catch(err){
        res.sendStatus(500)
    }
})

module.exports = router;