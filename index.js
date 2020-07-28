const winston = require('winston');
const express = require('express');
const app = express();
const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);
const io = socketIo(server);

require('./startup/logging');
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

let interval;
io.on("connection", (socket) => {
    console.log("New client connected");
    interval = setInterval(() => getApiAndEmit(socket), 1000);
    socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const getApiAndEmit = socket => {
    const response = new Date();
    socket.emit("FromAPI", response);
};
const port = process.env.PORT || 8080;
server.listen(port, () => winston.info(`Listening on port ${port}...`));