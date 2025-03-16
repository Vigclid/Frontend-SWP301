import React, { useEffect, useState , useRef} from "react";
import Chat from "./Chat";
import ChatIcon from "@mui/icons-material/Chat";
import "../css/ChatButton.css";
import { Badge } from "@mui/material";
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import {getChatByUserId, getChatProfileByUserId, getMessageBySenderId} from '../API/ChatAPT/GET.tsx'

const ChatButton = () => {
  // const audioRef = useRef(new Audio('/audios/notification.mp3'));
  // Attempt to retrieve the auth state from sessionStorage
    const savedAuth = sessionStorage.getItem("auth");
    // Check if there's any auth data saved and parse it
    const userInSession = savedAuth ? JSON.parse(savedAuth) : "";
    // Now 'auth' contains your authentication state or null if there's nothing saved

  const [isOpen, setIsOpen] = useState(false);
  const [chatProfile, setChatProfile] = useState([]);
  const [chat,setChat] = useState([]);
  const [_read_chat,set_read_chat] = useState(0);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
        //khởi tạo Chat history.
        const _getChattingUser = async () => {
          try {
            
              const profiles = await getChatProfileByUserId(userInSession.userId);
              const chat = await getChatByUserId(userInSession.userId);
              const message = await getMessageBySenderId(userInSession.userId);
              
              console.log(message);
              set_read_chat(chat.filter(chat => chat.status === 0).length);
              setChatProfile(profiles); 
              setChat(chat);
              setMessages(message);
            
          } catch (err) {
            console.log("No notifications!")
          }
        }
        _getChattingUser();
        // Tạo kết nối WebSocket
        const socket = new SockJS('http://localhost:7233/ws');
        const stompClient = Stomp.over(socket);
    
        stompClient.connect({}, () => {
          // Đăng ký nhận thông báo từ topic riêng của user
          stompClient.subscribe(`/topic/chat/${userInSession.userId}`, message => {
            const chats = JSON.parse(message.body);
            // Cập nhật state với thông báo mới

            setChat(prevChats => [...prevChats, chats]);
            
          });
        });
        // Cleanup khi component unmount
        return () => {
          if (stompClient) stompClient.disconnect();
        };
  }, []);

  
  useEffect(() => {
    console.log("Đã cập nhật")
    set_read_chat(chat.filter(c => c.status === 0).length);
  }, [chat]);
  
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
            <Chat onClose={() => setIsOpen(false)} chat={chat} chatProfile = {chatProfile}  message = {messages} userInSession = {userInSession}/>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatButton;
