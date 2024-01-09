const mongoose = require('mongoose')

function connection (cb) {
    mongoose.connect(process.env.MONDODB_URL,{
        dbName:'chatapp',
            
    }).then(()=>{
        console.log('connected to database')
        cb()
    }).catch((err)=>{
        console.log(err)
        console.log('Failed to connect mongodb')
    });


}
module.exports = {connection}