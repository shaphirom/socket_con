const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors : {
    origin :"*"
  }
});

const users = {}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    io.emit('msg_con', "Usuario Conectado")


    socket.on('setUsername',(username)=>{
        if(users[username]){
            socket.emit('userNameError', "El nombre de usuario ya esta en uso.")
        }else{
            users[username] = socket.id;
            socket.username = username;

            socket.emit('usernameSet', username);
        }
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message',{username: socket.username, msg})
      });


    socket.on('disconnect',()=>{
        io.emit('msg_con', "Usuario Desconectado");
    })
});



server.listen(3000, () => {
  console.log('listening on *:3000');
});