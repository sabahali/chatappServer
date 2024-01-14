const Redis = require("ioredis");
require('dotenv').config()
const redis = new Redis(process.env.REDIS_SERVER);
const { msgModel, groupModel, groupMsgModel, userModel } = require('../models/models')

const socketEvents = async (io, socket) => {

  // console.log('a user connected', socket.id);

  socket.on('userConnected', (user) => {
    console.log(user.name, 'connected')
    redis.set(user.userId, socket.id);
  });

  socket.on('sendMessage', (data, senderCb) => {
    // console.log(data);
    redis.get(data.receiver, async (err, recipientSocketId) => {
      if (err) console.log(err);
      if (recipientSocketId) {
        // console.log(recipientSocketId)
        io.to(recipientSocketId).timeout(1000).emit("newMessage", data, async (err, responses) => {
          if (err) {
            try {
              const newMsg = new msgModel({ ...data, seen: false, received: false })
              const result = await newMsg.save()
              senderCb({ status: 400 })
              // console.log(result)
            } catch (err) {
              senderCb({ status: 500 })
            }

          } else {
            console.log(responses);

            if (responses[0] === 'seen') {
              try {
                const newMsg = new msgModel({ ...data, seen: true, received: true })
                const result = await newMsg.save()
                senderCb({ status: 200 })
                // console.log(result)
              } catch (err) {
                senderCb({ status: 500 })
              }

            } else if (responses[0] === 'gotit') {
              try {
                const newMsg = new msgModel({ ...data, seen: false, received: true })
                const result = await newMsg.save()
                senderCb({ status: 201 })
                // console.log(result)
              } catch (err) {
                senderCb({ status: 500 })
              }
            }
            else {
              try {
                const newMsg = new msgModel({ ...data, seen: false, received: false })
                const result = await newMsg.save()
                senderCb({ status: 400 })
                // console.log(result)
              } catch (err) {
                senderCb({ status: 500 })
              }
            }
          }
        });
      } else {
        try {
          const newMsg = new msgModel({ ...data, seen: false, received: false })
          const result = await newMsg.save()
          senderCb({ status: 400 })
          // console.log(result)
        } catch (err) {
          senderCb({ status: 500 })
        }
      }
    });
  });

  socket.on('typing', (sender, receiver) => {
    redis.get(receiver, async (err, recipientSocketId) => {
      if (err) return
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('typing', sender)
      }
    })

  })
  socket.on('msgseen', async ({ _id, sender }) => {
    console.log('msgseen', _id, sender)
    try {
      const result = await msgModel.findByIdAndUpdate(_id, { seen: true })
      // console.log(result)
      redis.get(sender, async (err, socketId) => {
        // console.log('sendersocket',socketId)
        if (err) console.log(err)
        if (socketId) {
          io.to(socketId).emit('msgseenchange', _id)
        }
      })
    } catch (err) {
      console.log(err)
      socket.emit('error', 'DatabaseError')
    }

  })
  socket.on('allseen', async ({ sender, receiver }) => {
    // console.log(sender,receiver)
    try {
      const result = await msgModel.updateMany({ sender, receiver, received: false, seen: false }, { seen: true, received: true })
      // console.log(result)
      redis.get(sender, async (err, socketId) => {
        // console.log('sendersocket',socketId)
        if (err) console.log(err)
        if (socketId) {
          io.to(socketId).emit('msgseenchange', { sender, receiver })
        }
      })
    } catch (err) {
      console.log(err)
      socket.emit('error', 'DatabaseError')
    }

  })
  socket.on('sawreceived', async ({ sender, receiver }) => {
    try {
      const result = await msgModel.updateMany({ sender, receiver, seen: false }, { seen: true, received: true })
      // console.log(result)
      redis.get(sender, async (err, socketId) => {
        // console.log('sendersocket',socketId)
        // console.log(sender, receiver)
        if (err) {
          console.log(err)
        } else if (socketId) {
          io.to(socketId).emit('msgseenchange', { sender, receiver })
        }
      })
    } catch (err) {
      console.log(err)
      socket.emit('error', 'DatabaseError')
    }
  })
  socket.on('disconnect', () => {
    console.log('user disconnected');

  });

  //Groups things

  socket.on('createGroup', async ({ members, userId, grpname }) => {
    console.log(members, userId, grpname)
    try {
      const newGrp = new groupModel({
        name: grpname,
        members: [userId, ...members]

      })
      const result = await newGrp.save()
      const allmembers = [...members, userId]
      // console.log(result)
      try {
        const response = await userModel.updateMany(
          { _id: { $in: allmembers } }, // Match documents with IDs in the 'userIds' array
          { $push: { groups: result._id } } // Push 'resultId' into the 'groups' array
        );

        // console.log(response)
        socket.join(grpname)
        io.to(socket.id).emit('joinedgroup', { name: result.name, _id: result._id })

      } catch (err) {
        io.to(socket.id).emit('error', 'Database error')
      }
    } catch (err) {
      io.to(socket.id).emit('error', 'Database error')
    }
  })
  socket.on('joinGroup', async (groupId) => {
    const result = await groupModel.findById(groupId);
    redis.set(groupId, result?.name)
    socket.join(result?.name)
    // const rommMembs = io.sockets.adapter.rooms.get(result?.name);
    // console.log(rommMembs.size)

  })

  socket.on('sendMessagetogrp', async (data, { members }, senderCb) => {
    const { groupId } = data
    redis.get(groupId, async (err, room) => {
      if (err) {
        try {
          const newMsg = new groupMsgModel({ ...data, received: false, seen: false })
          await newMsg.save()
          senderCb({ status: 400 })
        } catch (err) {
          console.log(err)
          senderCb({ status: 500 })
        }
      }
      if (room) {
        socket.join(room)

        socket.to(room).timeout(1000).emit('newMsgtoGrp', data, async (err, response) => {
          if (err) {
            try {
              const newMsg = new groupMsgModel({ ...data, received: false, seen: false, seenBy: [data.sender] })
              await newMsg.save()
              senderCb({ status: 400 })
            } catch (err) {
              console.log(err)
              senderCb({ status: 500 })
            }
          } else if (response[0]) {
            // console.log(response)
            const seenBy = [data.sender];
            for (const item of response) {
              const array = item.split(',')
              if (array[0] === 'seen') {
                seenBy.push(array[1]);
              }
            }
            const seen = seenBy.length === members ? true : false;
            if (seen === true) {
              try {
                const newMsg = new groupMsgModel({ ...data, seenBy, received: true, seen: true })
                const resp = await newMsg.save()
                // console.log(resp)
                senderCb({ status: 200 })
              } catch (err) {
                console.log(err)
                senderCb({ status: 500 })
              }
            } else {
              try {
                const newMsg = new groupMsgModel({ ...data, seenBy, received: true, seen: false })
                const resp = await newMsg.save()
                // console.log(resp)
                senderCb({ status: 201 })
              } catch (err) {
                console.log(err)
                senderCb({ status: 500 })
              }
            }
          } else {
            try {
              const newMsg = new groupMsgModel({ ...data, received: false, seen: false, seenBy: [data.sender] })
              await newMsg.save()
              senderCb({ status: 400 })
            } catch (err) {
              console.log(err)
              senderCb({ status: 500 })
            }
          }

        })

      }
    })
  })
  socket.on('seenallgrpmsgs', async ({ groupId, userId }) => {
    // console.log(groupId)
    try {
      const result = await groupMsgModel.updateMany({ groupId },
        {
          $addToSet: { seenBy: userId },
          received: true,
        })
      // console.log(result)
      if (result.modifiedCount > 0) {
        redis.get(groupId, (err, room) => {
          socket.to(room).emit('msgSeenGrpchange', groupId)
        })
      }
    } catch (err) {
      console.log(err)
    }
  })
  socket.on('typing', (userId, groupId) => {
    redis.get(groupId, (err, room) => {
      socket.to(room).emit('typing', { userId, groupId })
    })
  })
};






module.exports = socketEvents