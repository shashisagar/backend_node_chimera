const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const http = require("http");
const app = express();
const socketIo = require("socket.io");

const getApiAndEmit = 

router.get('/', auth, async (req, res, socket) => {
    const server = http.createServer(app);
    const io = socketIo(server);
    io.on("connection", (socket) => {
        console.log("New client connected");
    });
    const response = new Date();
    socket.emit("FromAPI", response);
});

module.exports = router; 
