const express = require('express')
const router = express.Router()
const {userModel} = require('../models/models')
const jwt = require('jsonwebtoken')
require('dotenv').config()


router.get('/',async(req,res)=>{
    const person = await userModel.findOne({_id:req.query.userId});
    if(!person){
        res.status(400)
    }else{
        const accessToken = jwt.sign({email:person.email}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3600s' });
        const refreshToken = jwt.sign({email:person.email}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '604800s' });
        if(accessToken && refreshToken) {
        res.setHeader(
            'Set-Cookie',
            `SIDCHAT=${refreshToken}; HttpOnly; Max-Age=${24 * 60 * 60 * 7 }; Path=/;SameSite=None; Secure`
        ).json({accessToken,email:person.email,picture:person.picture,name:person.name}).status(200)
       }else {
        res.json("NetworkError").status(500)
       }
     
    }
})
module.exports = router;