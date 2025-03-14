import React, { useState, useEffect, useRef, useContext } from "react";
import { mockUsers, mockMessages } from "../share/MockChat";
import "../css/Chat.css";
import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import { ThemeContext } from "./Themes/ThemeProvider.tsx";
import { Button } from "@mui/material";

const Chat = ({ onClose }) => {
  const chatRef = useRef(null); 
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(mockUsers[0]);
  const messagesEndRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [previewChat, setPreviewChat] = useState(null);
  const {theme} = useContext(ThemeContext);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);



  //HANDLE
  useEffect(() => {
    
  }, [selectedUser, messages]);



  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const newMsg = {
      id: messages.length + 1,
      senderId: 1,
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


  const handlePopoverClose = () => {
    setAnchorEl(null);
    setPreviewChat(null);
  };

  const openPopover = Boolean(anchorEl);

  return (
    <Box
      ref={chatRef}
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: '70%',
        height: '80%',
        boxShadow: 3,
        borderRadius: 2,
        color :theme.color,
        backgroundColor: theme.backgroundColor,
        display: "flex",
      }}
    >
      
      
      <Box sx={{ width: "250px", borderRight: "1px solid #ccc" }}>
      <List>
        {mockUsers.map((user) => (
          <ListItem
            key={user.id}
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="user-avatar"
              style={{ width: 40, height: 40, borderRadius: "50%" }}
            />
            <Box sx={{ ml: 1 }}>
              <Typography variant="body2">{user.name}</Typography>
            </Box>
          </ListItem>
        ))}
      </List>
      </Box>

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 1,
            borderBottom: "1px solid #ccc",
          }}
        >
          <img
            src={selectedUser.avatar}
            alt={selectedUser.name}
            className="user-avatar"
            style={{ width: 40, height: 40, borderRadius: "50%" }}
          />

          
          
          <Box sx={{ ml: 1 }}>
            <Typography variant="subtitle1">{selectedUser.name}</Typography>
            <Typography variant="caption">{selectedUser.status}</Typography>
          </Box>
          <Box sx={{ marginLeft: "auto" }}>
            <Button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              ×
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            p: 1,
            scrollBehavior: "smooth", // Thêm để cuộn mượt hơn
          }}
        >
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                mb: 1,
                textAlign: message.senderId === 1 ? "right" : "left",
              }}
            >
              <Box
                sx={{
                  display: "inline-block",
                  p: 1,
                  bgcolor:
                    message.senderId === 1 ? "primary.main" : "grey.300",
                  color: message.senderId === 1 ? "white" : "black",
                  borderRadius: 1,
                  maxWidth: "80%",
                }}
              >
                {message.content}
              </Box>
              <Typography variant="caption">
                {formatTimestamp(message.timestamp)}
              </Typography>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        <Box
          component="form"
          sx={{
            display: "flex",
            p: 1,
            borderTop: "1px solid #ccc",
          }}
          onSubmit={handleSendMessage}
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            style={{
              flexGrow: 1,
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <Button
            type="submit"
            style={{
              marginLeft: "8px",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              border: "none",
              background: "none",
            }}
          >
            <SendIcon />
          </Button>
        </Box>
      </Box>

      <Popover
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: "center", horizontal: "right" }}
        transformOrigin={{ vertical: "center", horizontal: "left" }}
        disableRestoreFocus
      >
        <Typography sx={{ p: 2 }}>
          {previewChat ? previewChat.content : "Chưa có tin nhắn"}
        </Typography>
      </Popover>
    </Box>
  );
};

export default Chat;