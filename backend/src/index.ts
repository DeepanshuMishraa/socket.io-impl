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
let messages  = [];

app.get("/", (req, res) => {
  res.send("hello world");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on('disconnect',()=>{
    console.log('A user Left');
  })

  socket.on("message",(message)=>{
    console.log(`Message from client with id: ${socket.id} : ${message}`);
    messages.push(message)
    io.emit("message",message);
  })
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
