const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    name: String,
    picture: {
        type:String
    },
    groups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'groups'
    }],
    requests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }],
    contacts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }],

})
const messageSchema = new mongoose.Schema({
    _id: String,
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
        type: String,
        required: true
    },
    seen: {
        type: Boolean,
    },
    received: {
        type: Boolean,
    }
});

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }]
})
const grpMsgSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    msg: {
        type: String,
        required: true
    },
    seenBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    }],
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'groups',
        required: true
    },
    date: {
        type: String,
        required: true
    },
    seen: {
        type: Boolean
    },
    received: Boolean

})


const userModel = mongoose.model('users', userSchema)
const msgModel = mongoose.model('messages', messageSchema)
const groupModel = mongoose.model('groups', groupSchema)
const groupMsgModel = mongoose.model('groupmessages', grpMsgSchema)
module.exports = { userModel, msgModel, groupModel, groupMsgModel }