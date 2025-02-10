const express = require("express");
const app = express();
const http = require('http')
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);
const path = require('path');

app.set('view engine', 'ejs')
// app.use(express.static('views'))

app.use(express.static(path.join(__dirname, "views")));

const users = {};


//connection of chat
io.on('connection', socket =>{
    socket.on('new-user-joined', name =>{
        // a new user can join
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });
    // send message to user
    socket.on('submit', message =>{
        socket.broadcast.emit('receive',{ message: message , name: users[socket.id]})
    });
    //leave the user
    socket.on('disconnect',message =>{
        socket.broadcast.emit('leave',users[socket.id]);
        delete users[socket.id];
    });

});


//getting a chat in server side
app.get('/', (req,res) => {
    res.render('twit-chat.ejs');
})


// server listen
server.listen(3000, (http)=> {
    console.log(`Port is runnig on server http://localhost:3000`);

});
