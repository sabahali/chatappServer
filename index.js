const express = require('express')
const { Server } = require('socket.io');
const { createServer } = require('node:http');
const cookieParser = require('cookie-parser')
const socketEvents = require('./SocketRoutes/events')


const app = express();
const server = createServer(app);

app.use(cookieParser())
const io = new Server(server,{
    cors:{
        origin:'http://localhost:3000'
    }
});
const cors = require('cors')
const testRoute = require('./Routes/test');
const {connection} = require('./db');
app.use(cors({
    origin:'http://localhost:3000'
}))
app.use(express.json())
app.use('/reload',require('./Routes/reload'))
app.use('/redirecturi',require('./Routes/googleRedirect'));
app.use('/auth',require('./Routes/login'));
app.use('/getcontacts',require('./Database/getUsers'))
app.use('/getmsgs',require('./Database/getMsgs'))
app.use('/test', testRoute);



app.get('/',(req,res)=>{
    res.send("Server running")
})

io.on('connection', (socket) => {
    // console.log(socket.id)
    socketEvents(io,socket)
  });
  

connection(async()=>{
    server.listen(8000, async() => {
        console.log('server running at http://localhost:8000');
      });


    
})
