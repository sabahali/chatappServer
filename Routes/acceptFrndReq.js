const express = require('express');
const { userModel } = require('../models/models');
const router = express.Router()

router.get('/', async (req, res) => {
    console.log(req.query)
    try {
        const result = await userModel.updateOne(
            { _id: req.query.userId },
            { $addToSet: { contacts: req.query._id }, $unset: { requests: req.query._id } }
        );
        if (result.matchedCount > 0) {
            try {
                const result = await userModel.updateOne({ _id: req.query._id }, { $addToSet: { contacts: req.query.userId } })
                console.log(result)
                res.sendStatus(200)
            } catch (err) {
                res.sendStatus(500)

            }

        } else {
            res.sendStatus(400)
        }

    } catch (err) {
        res.sendStatus(500)
    }
})

module.exports = router;