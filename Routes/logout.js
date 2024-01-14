const express = require('express')
const router = express.Router()
const {userModel} = require('../models/models')
const jwt = require('jsonwebtoken')
require('dotenv').config()


router.get('/',async(req,res)=>{
   res.setHeader(
    'Set-Cookie',
    `SIDCHAT=''; HttpOnly; Max-Age=${24 * 60 * 60 * 7 }; Path=/;SameSite=None; Secure`
).json('Loggedout').status(200)
    
})
module.exports = router;