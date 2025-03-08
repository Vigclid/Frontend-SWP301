import React, { useState, useEffect, useRef } from "react";
import { mockUsers, mockMessages } from "../share/MockChat";
import "../css/Chat.css";
import SendIcon from "@mui/icons-material/Send";

const Chat = ({ onClose }) => {
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(mockUsers[0]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate receiving messages
  useEffect(() => {
    const autoResponses = [
      "That's interesting! Tell me more 🤔",
      "Amazing work! Keep it up! 👏",
      "I love your creative style! ✨",
      "Have you tried using different techniques?",
      "The composition looks perfect! 🎨",
    ];

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% chance of receiving a message
        const randomResponse = autoResponses[Math.floor(Math.random() * autoResponses.length)];
        const newAutoMessage = {
          id: messages.length + 1,
          senderId: selectedUser.id,
          content: randomResponse,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, newAutoMessage]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedUser]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsg = {
      id: messages.length + 1,
      senderId: 1, // Current user ID
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage("");
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="chat-container">
      <div className="users-sidebar">
        {mockUsers.map((user) => (
          <div
            key={user.id}
            className={`user-item ${selectedUser.id === user.id ? "active" : ""}`}
            onClick={() => setSelectedUser(user)}>
            <img src={user.avatar} alt={user.name} className="user-avatar" />
            <div className="user-info">
              <div className="user-name">{user.name}</div>
              <div className={`user-status ${user.status}`}>{user.status}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-main">
        <div className="chat-header">
          <img src={selectedUser.avatar} alt={selectedUser.name} className="user-avatar" />
          <div className="user-info">
            <div className="user-name">{selectedUser.name}</div>
            <div className={`user-status ${selectedUser.status}`}>{selectedUser.status}</div>
          </div>
          <button onClick={onClose} className="close-button">
            ×
          </button>
        </div>

        <div className="messages-container">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.senderId === 1 ? "sent" : "received"}`}>
              <div className="message-content">{message.content}</div>
              <div className="message-time">{formatTimestamp(message.timestamp)}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input" onSubmit={handleSendMessage}>
          <div className="input-container">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button type="submit" className="send-button">
              <span>Send</span>
              <SendIcon />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
