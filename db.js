const mongoose = require('mongoose')

function connection (cb) {
    mongoose.connect('mongodb+srv://sabahali:678601@cluster0.bvvmync.mongodb.net/?retryWrites=true&w=majority',{
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