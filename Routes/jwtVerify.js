const express = require('express')
const router = express.Router()
const {userModel} = require('../models/models')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const jWtVerify = (req,res,next) =>{
    const token = req.headers['authorization'] || req.headers['Authorization'] ;
    try{
        const accessToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3600s' });
        if(accessToken){
            next()
        }
    }catch(err){
        res.sendStatus(401)

    }
   
    
}

module.exports = jWtVerify