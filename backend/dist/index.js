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
let messages = []; // Store messages with proper structure
app.get("/", (req, res) => {
    res.send("Chat server running");
});
io.on("connection", (socket) => {
    console.log(`User connected with ID: ${socket.id}`);
    // Send existing messages to newly connected client
    socket.on("getMessages", () => {
        socket.emit("initialMessages", messages);
    });
    // Handle new messages
    socket.on("message", (messageData) => {
        messages.push(`User with id: ${socket.id} says : ${messageData}`);
        // Broadcast to all clients except sender
        socket.broadcast.emit("newMessage", messageData);
    });
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});
server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
