import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { 
  connectSocket, 
  joinChat, 
  sendMessage, 
  receiveMessage, 
  disconnectSocket,
  removeAllListeners
} from "./chatSocket";

function ChatBox({ chatId, userId }) {
  const [messages, setMessages] = useState([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!chatId || !userId) return;

    // Load existing messages from database first
    const loadMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/chats/${chatId}/messages?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMessages(response.data.messages);
        scrollToBottom();
      } catch (err) {
        console.error("Failed to load messages", err);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    // Then set up socket connection for real-time messages
    connectSocket(userId);
    joinChat(chatId, userId);
    
    const handleMessage = (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    };

    receiveMessage(handleMessage);

    return () => {
      removeAllListeners();
      disconnectSocket();
    };
  }, [chatId, userId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = () => {
    if (!body.trim()) return;
    
    // Send via HTTP first to ensure persistence
    axios.post(
      `http://localhost:5000/api/chats/${chatId}/messages`,
      { sender_id: userId, body },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    ).catch(err => {
      console.error("Failed to send message via HTTP", err);
      // Fallback to socket if HTTP fails
      sendMessage(chatId, userId, body);
    });
    
    setBody("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  if (loading) {
    return <div className="loading-messages">Loading messages...</div>;
  }

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`message ${msg.sender_id === userId ? "sent" : "received"}`}
          >
            <div className="message-header">
              <span className="sender">{msg.sender_name}</span>
              <span className="time">
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="message-body">{msg.body}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="message-input">
        <input
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
        />
        <button onClick={handleSend} disabled={!body.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBox;