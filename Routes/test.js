const express = require('express');
const router = express.Router();
const {userModel} = require('../models/models')

router.get('/', async(req, res) => {
    // Your route handling logic here
    console.log(req.query)
    const user = {
        name :'test',
        email:'test',
        picture : 'test'
    }
    const data = new userModel(user)
    await data.save().then((res)=>console.log(res)).catch(err=>console.log(err))
    res.send('This is the test route');
});

module.exports = router;
