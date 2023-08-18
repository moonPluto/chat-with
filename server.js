const path=require('path');
const http=require('http');
const express=require("express");
const socketio=require('socket.io');
const formatmessage=require('./utils/meassages');
const { Socket } = require('dgram');
 const {userjoin,getcurrentusr,userleves,getroomusr}=require('./utils/users');


const app =express();
const server=http.createServer(app);
const io=socketio(server);

const userbot='dipon'
app.use(express.static(path.join(__dirname,"public")));
io.on('connection',socket =>{
    socket.on('joinRoom',({username,room})=>{
        const user=userjoin(socket.id,username,room);

        socket.join(user.room);
    socket.emit('message', formatmessage(userbot,'welcome'));

    socket.broadcast.to(user.room).emit('message',formatmessage(userbot,
                                    `${user.username} is join`));

    io.to(user.room).emit('roomUsers',{
        room:user.room,
        users:getroomusr(user.room)
    });


    });


    socket.on('chatmessage',(msg)=>{
        const user=getcurrentusr(socket.id)

        io.to(user.room).emit('usermsg',formatmessage(user.username,msg));
    });

    socket.on('disconnect',()=>{
        const user=userleves(socket.id);
        if(user){
           io.to(user.room).emit('message', formatmessage(userbot,
                                `${user.username} is left`));}

                                
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getroomusr(user.room)
        });
    

           });


});

const PORT=3000 || process.env.PORT;

server.listen(PORT,()=> console.log(`server is running on ${PORT}`));