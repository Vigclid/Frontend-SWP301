import React, { useState } from "react";
import Chat from "./Chat";
import ChatIcon from "@mui/icons-material/Chat";
import "../css/ChatButton.css";
import { Badge } from "@mui/material";

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="chat-button" onClick={toggleChat}>
        <Badge color="secondary" badgeContent={1}>
          <ChatIcon className="chat-icon" />
        </Badge>
      </div>

      {isOpen && (
        <div
          className="chat-modal-overlay"
          onClick={(e) => {
            if (e.target.classList.contains("chat-modal-overlay")) {
              setIsOpen(false);
            }
          }}>
          <div className="chat-modal">
            <Chat onClose={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatButton;
