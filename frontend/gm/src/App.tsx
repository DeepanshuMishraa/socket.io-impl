// types.ts
 interface MessageData {
  text: string;
  id: number;
  userId: string;
}

// App.tsx
import { useState, useEffect, KeyboardEvent, ChangeEvent } from "react";
import { io, Socket } from "socket.io-client";


const socket: Socket = io("http://localhost:3000");

function App() {
  const [msg, setMsg] = useState<string>("");
  const [messages, setMessages] = useState<MessageData[]>([]);

  useEffect(() => {
    // Get initial messages
    socket.emit("getMessages");

    // Listen for initial messages
    socket.on("initialMessages", (data: MessageData[]) => {
      setMessages(data);
    });

    // Listen for new messages
    socket.on("newMessage", (message: MessageData) => {
      setMessages((prev) => [...prev, message]);
    });

    // Clean up socket listeners
    return () => {
      socket.off("initialMessages");
      socket.off("newMessage");
    };
  }, []);

  const sendMessage = (): void => {
    if (msg.trim() !== "") {
      const messageData: MessageData = {
        text: msg,
        id: Date.now(),
        userId: socket.id as string
      };

      socket.emit("message", messageData);
      setMessages((prev) => [...prev, messageData]); // Add message locally
      setMsg(""); // Clear input
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setMsg(e.target.value);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4 h-96 overflow-y-auto border rounded p-4">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div
                key={message.id}
                className={`mb-2 p-2 rounded ${
                  message.userId === socket.id
                    ? 'bg-blue-100 ml-auto max-w-[80%]'
                    : 'bg-gray-100 mr-auto max-w-[80%]'
                }`}
              >
                {message.text}
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center">No messages yet</div>
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border rounded p-2"
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            value={msg}
            placeholder="Type a message"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            type="button"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

// vite-env.d.ts (Add this file in your src directory if it doesn't exist)
/// <reference types="vite/client" />
