const winston = require('winston');
const express = require('express');
const app = express();
const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);
const io = socketIo(server);
const {ChatMessage, validate} = require('./models/chatMessage');
const {User} = require('./models/user');

require('./startup/logging');
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

var users = {};
io.on("connection", (socket) => {
    socket.on('adduser', function(data) {
        users[socket.id] = data._id;
        updateNicknames();
    });

    socket.on("message", async (e) => {
        const data = {
            toId : e.to,
            fromId : e.from,
            is_read : e.is_read,
            message : e.message.text
        }
        const chatMessage = new ChatMessage(data);
        await chatMessage.save();
        io.emit("message",e);
    });  

    //showing user typing
    socket.on("typing", function(data) {
        io.emit("typing", data);
    });

    socket.on('disconnect', function(data){
        delete users[socket.id];
        updateNicknames();
    });

    function updateNicknames(){
        io.emit('usernames', users);
    }
});

const port = process.env.PORT || 8080;
server.listen(port, () => winston.info(`Listening on port ${port}...`));