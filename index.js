const winston = require('winston');
const express = require('express');
const app = express();
const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);
const io = socketIo(server);
const {ChatMessage, validate} = require('./models/chatMessage');

require('./startup/logging');
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

var clients = [];
io.on("connection", (socket) => {
    socket.on("message", async (e) => {
        console.log(e);
        const data = {
            toId : e.to,
            fromId : e.from,
            message : e.message.text
        }
        const chatMessage = new ChatMessage(data);
        await chatMessage.save();
        io.emit("message",e);
    });    
});

const port = process.env.PORT || 8080;
server.listen(port, () => winston.info(`Listening on port ${port}...`));