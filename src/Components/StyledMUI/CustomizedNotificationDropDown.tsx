import React, { useContext,useState , useEffect ,useRef } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Box, Button, IconButton, List ,ListItemButton, ListItemAvatar , ListItemText 
   , Avatar 
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {ThemeContext} from "../Themes/ThemeProvider.tsx"
import MailIcon from '@mui/icons-material/Mail';
import { Creator } from '../../Interfaces/UserInterface.ts';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatIcon from '@mui/icons-material/Chat';
import { styled } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { Notification } from '../../Interfaces/NotificationInterfaces.ts';
import axios from "axios";
import { useAuth } from '../AuthenContext.tsx';
const notificationsURL = `${process.env.REACT_APP_API_URL}/notification/`
const followingUserByFollowId = `${process.env.REACT_APP_API_URL}/Follow/user/`
interface CustomizedDropdownProps {
  user: Creator;
  handleClickAsGuest: any;
}
function CustomizedNotificationDropDown({user,handleClickAsGuest } : CustomizedDropdownProps)  {

    const audioRef = useRef(new Audio('/audios/notification.mp3'));

    const { logout } = useAuth();

    const { theme } = useContext(ThemeContext);
    const [anchorEl, setAnchorEl] = useState(null)
    const [open, setOpen] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [profiles, setProfiles] = useState<Record<string, Creator>>({});
    const [newNotiCount, setNewNotiCount] = useState<number>();


    const handleClickDropdown = (event) => {
        if (user === null) {
        handleClickAsGuest()
        }
        else {
        axios.put(`${notificationsURL}${user.userId}`);
        setNewNotiCount(0);
        setAnchorEl(event.currentTarget)
        setOpen(!open)
        }
    };

    useEffect(() => {
      //khởi tạo Notificaitons history.
      const _getNotificationsByUserId = async () => {
        try {
          const response = await axios.get(`${notificationsURL}${user.userId}`);
          setNewNotiCount(response.data.filter(notification => notification.isRead === 0).length)
          setNotifications(response.data)
        } catch (err) {
          console.log("No notifications!")
        }
      }
      _getNotificationsByUserId();
      // Tạo kết nối WebSocket
      const socket = new SockJS(`${process.env.REACT_APP_DNS}/ws`);
      const stompClient = Stomp.over(socket);
  
      stompClient.connect({}, () => {
        // Đăng ký nhận thông báo từ topic riêng của user
        stompClient.subscribe(`/topic/notifications/${user.userId}`, message => {
          const notification = JSON.parse(message.body);
          // Cập nhật state với thông báo mới
          setNotifications(prev => [notification, ...prev]);
        });

        stompClient.subscribe(`/topic/lockUser/${user.accountId}`, message => {
          logout();
          alert("Your account has been banned by Admin.");
        });
      });
  
      // Cleanup khi component unmount
      return () => {
        if (stompClient) stompClient.disconnect();
      };
    }, [user]);


    useEffect(() =>{
      const fetchProfiles = async () => {

        const profilePromises = notifications.map(async (notification) => {
          
          if (notification.followID && !profiles[notification.notificationId]) { // Sử dụng followID làm key
            const response = await axios.get(`${followingUserByFollowId}${notification.followID}`);
            
            return { userId: notification.notificationId, profile: response.data };
          }
          
          if (notification.transferID && !profiles[notification.notificationId]) { // Sử dụng followID làm key
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/Payment/trans/sender/${notification.transferID}`);
            return { userId: notification.notificationId, profile: response.data };
          }

          return null;
        });
    
        const profileResults = await Promise.all(profilePromises);
        const newProfiles = profileResults.reduce((acc, item) => {
          if (item) acc[item.userId] = item.profile;
          return acc;
        }, {});
    
        setProfiles((prev) => ({ ...prev, ...newProfiles }));
      };
    
      if (notifications.length > 0) {
        fetchProfiles();
      }
    

      audioRef.current.play().catch(error => {
        console.log(error)
      })
      

      setNewNotiCount(prev => (prev ?? 0) + 1);
    },[notifications.length]);



    const CustomizedMenu = styled(Menu)(() => ({  
        '& .MuiPaper-root': {
          backgroundColor: theme.backgroundColor,
          boxShadow: '0px 4px 20px rgba(77, 77, 77, 0.5)',
          color: theme.color,
          border: theme.borderColor,
        },
        '': {
          border: `1px, ${theme.color}`
        }
        // Any additional styles you want to apply
      }));
    
      function DropdownContent() {
        const [value, setValue] = React.useState('recents');

        const handleChange = (event: React.SyntheticEvent, newValue: string) => {
            setValue(newValue);
        };
        return (
          <>
          {(
            <List>
            {notifications.map((notification, index) => {
            const profile = notification.notificationId ? profiles[notification.notificationId] : null;
            
            return (
              <Link to={`profile/${profile?.accountId}`}>
                <ListItemButton key={index}>
                  <ListItemAvatar key={profile?.accountId}>
                    <Avatar alt="Profile Picture" src={profile?.profilePicture} />
                  </ListItemAvatar>
                  <ListItemText 

                    primary={`Hello ${user.firstName} ${user.lastName}`} 
                    secondary={
                      notification.message?.includes('#3') ? `${notification.message?.slice(2)} | ${notification.amount}$ | ${profile?.firstName} ${profile?.lastName}`:
                      notification.message?.includes('#2') ? `You just withdrawl ${notification.amount}!` :
                        `${notification.message} | ${profile?.firstName} ${profile?.lastName}`
                    }
                    primaryTypographyProps={{ sx: { color: theme.color } }}
                    secondaryTypographyProps={{ sx: { color:  theme.color2 } }}
                  />
                </ListItemButton>
              </Link>
            );
          })}

          </List>
          )}

          </>
        )
      }  
    
    function Dropdown() {
    return (
        <CustomizedMenu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClickDropdown}
            anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
            }}
            transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'left', flexDirection: 'column' }}>
            <DropdownContent />
            </Box>
        </CustomizedMenu >
        )
    }
      
    return (
        //HIỂN THỊ CÁI GÌ, SỐ LƯỢNG NOTFICATION CHƯA XEM
      <Box>
        <IconButton 
                onClick={handleClickDropdown}
                aria-controls={open ? 'account-menu' : ''}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : 'false'}
            >
        <Badge color="secondary" badgeContent={newNotiCount} >
            
            <MailIcon sx={{ width: 30, height: 30 , color : theme.color}}/>
            
        </Badge>
        </IconButton>
        {
        user === null ?
          <></>
          :
          <Dropdown />
      }
      </Box>
    );
  }


export default CustomizedNotificationDropDown;