const express = require('express')
const router = express.Router()
const {userModel} = require('../models/models')
const jwt = require('jsonwebtoken')
require('dotenv').config()


router.get('/', async (req, res) => {
    res.clearCookie('SIDCHAT', {
      httpOnly: true,
      maxAge: 0,
      path: '/',
      sameSite: 'None',
      secure: true,
    }).json('Logged out').status(200);
  });
    

module.exports = router;