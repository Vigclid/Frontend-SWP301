import React, { useEffect, useState } from "react";
import Chat from "./Chat";
import ChatIcon from "@mui/icons-material/Chat";
import "../css/ChatButton.css";
import { Badge } from "@mui/material";
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import {getChatProfileByUserId} from '../API/ChatAPT/GET.tsx'

const ChatButton = () => {
  // Attempt to retrieve the auth state from sessionStorage
    const savedAuth = sessionStorage.getItem("auth");
    // Check if there's any auth data saved and parse it
    const userInSession = savedAuth ? JSON.parse(savedAuth) : "";
    // Now 'auth' contains your authentication state or null if there's nothing saved

  const [isOpen, setIsOpen] = useState(false);
  const [chat, setChat] = useState([]);
  const [_read_chat,set_read_chat] = useState(0);

  useEffect (() => {
    const _getChattingUser = async() => {
      const profiles = await getChatProfileByUserId(userInSession.userId);
      setChat(profiles);
    }
  },[chat])

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };



  return (
    <>
      <div className="chat-button" onClick={toggleChat}>
        <Badge color="secondary" badgeContent={_read_chat}>
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
