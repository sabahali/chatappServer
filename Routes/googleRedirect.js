const express = require('express')
const router = express.Router();
const { google } = require('googleapis');
const { jwtDecode } = require('jwt-decode')
const { userModel } = require('../models/models')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
);

router.get('/', async (req, res) => {
    let userId;
    try {
        const { tokens } = await oauth2Client.getToken(req.query.code);
        const decoded = jwtDecode(tokens.id_token)
        // console.log(decoded)
        const userData = {
            email: decoded.email,
            name: decoded.name,
            picture: decoded.picture
        }
        try {
            const person = await userModel.findOne({ email: decoded.email });
            userId = person._id
            // console.log(person)
            if(!person){
                const data = new userModel(userData);
                try{
                    const resp = await data.save()
                    console.log(res);
                    userId = resp._id
                }catch(err){
                    console.log(err)
                }
             }
             res.redirect(`http://localhost:3000/login/${userId}`)
        } catch (err) {
            res.redirect(`http://localhost:3000/login/`)
            console.log(err)
        }
    } catch (err) {
        res.redirect(`http://localhost:3000/login/`)
        console.log(err)
        
    }

})

module.exports = router;