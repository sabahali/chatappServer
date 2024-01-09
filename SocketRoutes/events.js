const Redis = require("ioredis");
require('dotenv').config()
const redis = new Redis(process.env.REDIS_SERVER);
const { msgModel } = require('../models/models')

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
              const newMsg = new msgModel({...data,seen:false,received:false})
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
                const newMsg = new msgModel({...data,seen:true,received:true})
                const result = await newMsg.save()
                senderCb({ status: 200 })
                console.log(result)
              } catch (err) {
                senderCb({ status: 500 })
              }

            }else if(responses[0] === 'gotit'){
              try {
                const newMsg = new msgModel({...data,seen:false,received:true})
                const result = await newMsg.save()
                senderCb({ status: 201 })
                console.log(result)
              } catch (err) {
                senderCb({ status: 500 })
              }
            }
            else{
              try{
                const newMsg = new msgModel({...data,seen:false,received:false})
                const result = await newMsg.save()
                senderCb({ status: 400 })
                // console.log(result)
              }catch(err){
                senderCb({ status: 500 })
              }
            }
          }
        });
      } else {
        try {
          const newMsg = new msgModel({...data,seen:false,received:false})
          const result = await newMsg.save()
          senderCb({ status: 400 })
          console.log(result)
        } catch (err) {
          senderCb({ status: 500 })
        }
      }
    });
  });

  socket.on('typing',(sender,receiver)=>{
    redis.get(receiver, async (err, recipientSocketId) => {
      if(err) return
      if(recipientSocketId){
        io.to(recipientSocketId).emit('typing',sender)
      }
    })
    
  })
 socket.on('msgseen',async({_id,sender})=>{
  console.log('msgseen',_id,sender)
    try{
      const result = await msgModel.findByIdAndUpdate(_id,{seen:true})
      // console.log(result)
      redis.get(sender, async (err, socketId) => {
        // console.log('sendersocket',socketId)
        if(err) console.log(err)
        if(socketId){
          io.to(socketId).emit('msgseenchange',_id)
        }
      })
    }catch(err){
      console.log(err)
      socket.emit('error','DatabaseError')
    }
    
 })
 socket.on('allseen',async({sender,receiver})=>{
  console.log(sender,receiver)
  try{
    const result = await msgModel.updateMany({sender,receiver,received:false},{seen:true,received:true})
    console.log(result)
    redis.get(sender, async (err, socketId) => {
      console.log('sendersocket',socketId)
      if(err) console.log(err)
      if(socketId){
        io.to(socketId).emit('msgseenchange',{sender,receiver})
      }
    })
  }catch(err){
    console.log(err)
      socket.emit('error','DatabaseError')
  }
  
 })
 socket.on('sawreceived',async({sender,receiver})=>{
  try{
    const result = await msgModel.updateMany({sender,receiver,received:true},{seen:true})
    console.log(result)
    redis.get(sender, async (err, socketId) => {
      // console.log('sendersocket',socketId)
      if(err) console.log(err)
      if(socketId){
        io.to(socketId).emit('msgseenchange',{sender,receiver})
      }
    })
  }catch(err){
    console.log(err)
      socket.emit('error','DatabaseError')
  }
 })

  socket.on('disconnect', () => {
    console.log('user disconnected');

  });
};

module.exports = socketEvents