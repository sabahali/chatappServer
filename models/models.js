const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    name: String,
    picture: String,

})
const messageSchema = new mongoose.Schema({
    _id:String,
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    msg: {
        type: String,
        required: true
    },
    date: {
        type :String,
        required: true
    },
    seen:{
        type :Boolean,
    },
    received:{
        type :Boolean,
    }
});

const userModel = mongoose.model('users', userSchema)
const msgModel = mongoose.model('messages', messageSchema)
module.exports = { userModel,msgModel }