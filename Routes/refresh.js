const express = require('express')
const router = express.Router()
const { userModel } = require('../models/models')
const jwt = require('jsonwebtoken')
require('dotenv').config()
router.get('/', async (req, res) => {
    const refresh = req.cookies['SIDCHAT']
    try {
        const decoded = jwt.verify(refresh, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '604800s' });
        if (decoded) {
            try {
                const accessToken = jwt.sign({ email: decoded.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3600s' });
                res.send(accessToken)
            } catch (err) {
                console.log(err)
                res.sendStatus(403)
            }

        } else {
            res.sendStatus(403)
        }
    } catch (err) {
        res.sendStatus(403)
    }

})
module.exports = router;