"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_http_1 = require("node:http");
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = (0, node_http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    },
});
let messages = [];
app.get("/", (req, res) => {
    res.send("hello world");
});
io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on('disconnect', () => {
        console.log('A user Left');
    });
    socket.on("message", (message) => {
        console.log(`Message from client with id: ${socket.id} : ${message}`);
        messages.push(message);
        io.emit("message", message);
    });
});
server.listen(3000, () => {
    console.log("server running at http://localhost:3000");
});
