import React, { useContext, useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Switch from '@mui/material/Switch';
import { faGem } from '@fortawesome/free-solid-svg-icons';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { ThemeContext } from '../Themes/ThemeProvider.tsx';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthenContext.tsx';
import { Creator } from '../../Interfaces/UserInterface';
import { LightDarkSwitch } from './CustomizedLightDarkSwitch.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CurrentPackage } from '../../Interfaces/Package.ts';

//Create an interface for your function to assign types to its props
interface CustomizedDropdownProps {
  user: Creator;
  handleClickAsGuest: any;
  pack: CurrentPackage | null;
}
export default function CustomizedDropdown({ user, handleClickAsGuest,pack }: CustomizedDropdownProps) {


  const { theme, toggleTheme, dark } = useContext(ThemeContext)
  const { logout } = useAuth();
  // Custom style for the Menu component
  const CustomizedMenu = styled(Menu)(() => ({  
    '& .MuiPaper-root': {
      backgroundColor: theme.backgroundColor,
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.5)',
      color: theme.color,
      border: theme.borderColor,
    },
    '': {
      border: `1px, ${theme.color}`
    }
    // Any additional styles you want to apply
  }));
  const [anchorEl, setAnchorEl] = useState(null)
  const [open, setOpen] = useState(false)
  useEffect(() => {
  }
  )
  const handleClickDropdown = (event) => {
    if (user === null) {
      handleClickAsGuest()
    }
    else {
      setAnchorEl(event.currentTarget)
      setOpen(!open)
    }
  };

  function DropdownContent() {
    return (
      <>
        <Divider sx={{ "&::before, &::after": { backgroundColor: theme.color } }} variant='middle'>
          <Typography variant='caption'>Account</Typography>
        </Divider>
        <MenuItem ><Link to={`profile/${user.accountId}`}>Profile</Link></MenuItem>
        <MenuItem ><Link to={`dashboarduser`}>My Dashboard</Link></MenuItem>
        {/* <MenuItem >My Account</MenuItem> */}
        <Divider sx={{ "&::before, &::after": { backgroundColor: theme.color } }} variant='middle'>
          <Typography variant='caption'>Theme</Typography>
        </Divider>
        <MenuItem >
          <LightDarkSwitch onClick={toggleTheme} checked={dark} />
        </MenuItem>
        <Divider sx={{ "backgroundColor": { backgroundColor: theme.color } }} variant='middle' />
        <MenuItem onClick={logout}>Logout</MenuItem>
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

  const vipEffect = {
    zIndex: 1000,
    textAlign: 'center',
    position: "absolute",
    bottom: 0,
    right: 0,
    bgcolor: "gold",
    padding: "2px 6px",
    borderRadius: "4px",
    transform: "translate(-45%, 25%)", // Adjusts the position to center at bottom-right of the icon
    typography: "body2",
    fontWeight: "bold",
    color: "black", // Text color against the gold background for contrast
    width: "auto",
    height: "auto",
    display: "flex",
    justifyCotents: "space-between",
    "&:after": { // Shiny gradient overlay
      content: '" "',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: "linear-gradient(45deg, rgba(255,255,255,0.6), transparent)",
      opacity: 0.5,
      borderRadius: "inherit",
    },
    //Blinking animation
    animation: "blink-animation 15s infinite", // Apply the blink animation
    // Define keyframes for the blinking animation
    "@keyframes blink-animation": {
      "0%, 100%": {
        bgcolor: "gold",
        color: "black",
        boxShadow: "0 0 8px rgba(255, 215, 0, 0.6)",
      },
      "50%": {
        bgcolor: "black",
        color: "gold",
        boxShadow: "0 0 8px rgba(0, 0, 0, 0.6)",
      }
    }
  }

  const premiumText = () => {
    return (
      <Typography sx={vipEffect} variant='body2' color={"gold"}>
        VIP<FontAwesomeIcon icon={faGem} style={{ marginTop: "5%", marginLeft: "2px" }} />
      </Typography>
    )
  }
  return (
    <div>
      {pack?.typeID=== 2? premiumText() : ""}
      <IconButton
        onClick={handleClickDropdown}
        size="small"
        sx={{  }}
        aria-controls={open ? 'account-menu' : ''}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : 'false'}
      >
        <Avatar src={user ? `${user.profilePicture}` : ""} sx={{ width: 40, height: 40 }}>{user ? user.userName : ""}</Avatar>
      </IconButton>
      {
        user === null ?
          <></>
          :
          <Dropdown />
      }

    </div>
  );
}
