"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
function App() {
    const socket = (0, socket_io_client_1.io)("http://localhost:3000");
    socket.on("connect", () => {
        console.log("Connected");
    });
    return <h1>Hello world</h1>;
}
exports.default = App;
