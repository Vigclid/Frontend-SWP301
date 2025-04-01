import React, { useEffect, useState , useRef} from "react";
import Chat from "./Chat";
import ChatIcon from "@mui/icons-material/Chat";
import "../css/ChatButton.css";
import { Badge } from "@mui/material";
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import {getChatByUserId, getChatProfileByUserId, getMessageBySenderId} from '../API/ChatAPT/GET.tsx'
import { updateStatusChatByUserId } from "../API/ChatAPT/PUT.tsx";
import { GetCreatorByID } from "../API/UserAPI/GET.tsx";
import { redirect } from "react-router-dom";
import { Button, Snackbar, Alert } from '@mui/material';

const ChatButton = () => {
  const audioRef = useRef(new Audio('/audios/notification.mp3'));
  // Attempt to retrieve the auth state from sessionStorage
    const savedAuth = sessionStorage.getItem("auth");
    // Check if there's any auth data saved and parse it
    const userInSession = savedAuth ? JSON.parse(savedAuth) : "";
    // Now 'auth' contains your authentication state or null if there's nothing saved

    const [snack, setSnack] = useState({
      open: false,
      message: '',
      severity: 'info', // 'info', 'warning', 'error', 'success'
    });
  
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') return;
      setSnack(prev => ({ ...prev, open: false }));
    };

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
            console.log("No Chat")
          }
        }
        _getChattingUser();
        // Tạo kết nối WebSocket để xử lý Chat!
        const socket = new SockJS(`http://${process.env.REACT_APP_DNS}/ws`);
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
          // Đăng ký nhận thông báo từ topic riêng của user
          stompClient.subscribe(`/topic/chat/${userInSession.userId}`, message => {
            const chats = JSON.parse(message.body);
            // Cập nhật state với thông báo mới

            setChat(prevChats => {
              // Tìm chat đã tồn tại có cặp user1Id, user2Id khớp với chat mới (hoặc đảo ngược)
              const existingIndex = prevChats.findIndex(chat =>
                (chat.user1Id === chats.user1Id && chat.user2Id === chats.user2Id) ||
                (chat.user1Id === chats.user2Id && chat.user2Id === chats.user1Id)
              );
              if (existingIndex !== -1) {
                // Nếu đã tồn tại, cập nhật status thành 0
                const updatedChats = [...prevChats];
                updatedChats[existingIndex] = { ...updatedChats[existingIndex], status: 0 };
                return updatedChats;
              } else {
                // Nếu chưa tồn tại, thêm chat mới vào danh sách
                const _getProfileData = async() => {
                  const _user =  await GetCreatorByID(chats.user1Id);
                  setChatProfile(prev => [_user,...prev])
                  
                }
                _getProfileData();
                return [...prevChats, chats];
              }
            });
            
          });

          //CHAY DIIIIIIIIIIIIIIIIIIIIIIIIII
          stompClient.subscribe(`/topic/message/${userInSession.userId}`, mes => {
            const _mes = JSON.parse(mes.body);
          if (_mes.dateSent) {
            const date = new Date(_mes.dateSent);
            date.setHours(date.getHours() + 7);
            _mes.dateSent = date.toISOString();
          }
          setMessages(prevMessages => [...prevMessages, _mes]);
          setChat(prevChats => {
            // Tìm chat đã tồn tại có cặp user1Id, user2Id khớp với chat mới (hoặc đảo ngược)
            const existingIndex = prevChats.findIndex(chat =>
              (chat.user1Id === _mes.senderId && chat.user2Id === _mes.receiverId) ||
              (chat.user1Id === _mes.receiverId && chat.user2Id === _mes.senderId)
            );
            if (existingIndex !== -1) {
              const updatedChats = [...prevChats];
              updatedChats[existingIndex] = { ...updatedChats[existingIndex], status: 0 };
              return updatedChats;
            } else {
              const newChat = {
                user1Id: _mes.senderId,
                user2Id: _mes.receiverId,
                status: 0,
              };
              const _a = async () => {
                const _user = await GetCreatorByID(_mes.senderId);
                setChatProfile(prev => {
                  // Kiểm tra nếu đã có user trong mảng thì không thêm nữa
                  if (prev.some(user => user.userId === _user.userId)) {
                    return prev;
                  }
                  return [_user, ...prev];
                });
              };
              _a();

              return [...prevChats, newChat];
              
              
            }
          });
          audioRef.current.play().catch(error => {
            console.log(error)
          })
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
    if (!savedAuth) {
      setSnack({
        open: true,
        message: "You need to login to access this feature!",
        severity: "warning"
      });
      return;
    } else if (chat.length === 0) {
      setSnack({
        open: true,
        message: "You don't have any chat!",
        severity: "info"
      });
      return;
    }
    const newChat = {
            chatId : 0,
            user1Id : Number(userInSession?.userId),
            user2Id : Number(0),
            status : 0,
          }
    updateStatusChatByUserId(newChat);
    setChat(prevChats => prevChats.map(chat => ({ ...chat, status: 1 })));
    setIsOpen(!isOpen);
  };



  return (
    <>
      
      <div className="chat-button" onClick={toggleChat}>
        <Badge color="secondary" badgeContent={_read_chat}>
          <ChatIcon className="chat-icon" />
        </Badge>
      </div>

      {isOpen && savedAuth &&  chat.length && (
        <div
          className="chat-modal-overlay"
          onClick={(e) => {
            if (e.target.classList.contains("chat-modal-overlay")) {
              setIsOpen(false);
            }
          }}>
          <div className="chat-modal">
            <Chat onClose={() => setIsOpen(false)} chat={chat} chatProfile = {chatProfile}  
            message = {messages} userInSession = {userInSession} setMessage={setMessages}/>
          </div>
        </div>
      )}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ChatButton;
