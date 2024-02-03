const express = require('express')
const { Server } = require('socket.io');
const cors = require('cors')
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

const testRoute = require('./Routes/test');
const {connection} = require('./db');
app.use(cors({
    origin:['http://localhost:3000'],
    credentials:true
}))
app.use(express.json())
app.use('/reload',require('./Routes/reload'))
app.use('/redirecturi',require('./Routes/googleRedirect'));
app.use('/auth',require('./Routes/login'));
app.use('/refresh',require('./Routes/refresh'))
app.use(require('./Routes/jwtVerify'))
// app.use('/getcontacts',require('./Database/getUsers'))
app.use('/getmsgs',require('./Database/getMsgs'))
app.use('/getgrps',require('./Database/getGroups'))
app.use('/getgroupmsgs',require('./Database/getGroupMsgs'))
app.use('/sendfriendreq',require('./Routes/sendFrndReq'))
app.use('/acceptReq',require('./Routes/acceptFrndReq'))
app.use('/getusercontacts',require('./Database/getRequests'))
 app.use('/getcontacts',require('./Database/getContacts'))
app.use('/logout',require('./Routes/logout'));
app.use('/adddp',require('./Database/addPicture'))
// app.use('/test', testRoute);



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
