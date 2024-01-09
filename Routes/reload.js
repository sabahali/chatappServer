const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken');
const {userModel} = require('../models/models')

require('dotenv').config()
router.get('/',async(req,res)=>{
    const refreshToken = req.cookies['SIDCHAT']
    if(refreshToken){
        const decoded = jwt.verify(refreshToken,process.env.ACCESS_TOKEN_SECRET)
        if(decoded){
            try{
                const person = await userModel.findOne({email:decoded.email});
                if(!person){
                    res.status(400)
                }else{
                    const accessToken = jwt.sign({email:person.email}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3600s' });
                    if(accessToken && refreshToken) {
                    res.json({accessToken,email:person.email,picture:person.picture,name:person.name,userId:person._id}).status(200)
                   }else {
                    res.json("NetworkError").status(500)
                   }
                 
                }
            }catch(err){
                res.sendStatus(500)
            }
            

        }else{
            res.redirect(process.env.BASE_URL)
        }
    }else {
        res.redirect(process.env.BASE_URL)
    }
})



module.exports = router;