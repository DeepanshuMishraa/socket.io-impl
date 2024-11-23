import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

function App() {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Set up the socket event listener
    socket.on("message", (data) => {
      setMessages(data); // Expecting an array from the server
    });

    // Clean up the socket event listener when the component unmounts
    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    if (msg.trim() !== "") {
      socket.emit("message", msg); // Send the message to the server
      setMsg(""); // Clear the input field
    }
  };

  return (
    <div>
      <input
        type="text"
        onChange={(e) => setMsg(e.target.value)}
        value={msg}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
