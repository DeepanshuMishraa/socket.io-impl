import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

let messages:any = []; // Store messages with proper structure

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
