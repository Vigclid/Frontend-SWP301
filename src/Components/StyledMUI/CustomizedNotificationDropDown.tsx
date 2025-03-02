import React, { useContext,useState , useEffect } from 'react';
import { Badge, Box, Button, IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import {ThemeContext} from "../Themes/ThemeProvider.tsx"
import MailIcon from '@mui/icons-material/Mail';
import { Creator } from '../../Interfaces/UserInterface.ts';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FolderIcon from '@mui/icons-material/Folder';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { styled } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
interface CustomizedDropdownProps {
  user: Creator;
  handleClickAsGuest: any;
}
function CustomizedNotificationDropDown({user,handleClickAsGuest } : CustomizedDropdownProps)  {

    const { dark,theme } = useContext(ThemeContext);
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
    
      function DropdownContent() {
        const [value, setValue] = React.useState('recents');

        const handleChange = (event: React.SyntheticEvent, newValue: string) => {
            setValue(newValue);
        };
        return (
            <BottomNavigation sx={{ width: 500 }} value={value} onChange={handleChange}>
            <BottomNavigationAction
              label="Recents"
              value="recents"
              icon={<RestoreIcon />}
            />
            <BottomNavigationAction
              label="Favorites"
              value="favorites"
              icon={<FavoriteIcon />}
            />
            <BottomNavigationAction
              label="Nearby"
              value="nearby"
              icon={<LocationOnIcon />}
            />
            <BottomNavigationAction label="Folder" value="folder" icon={<FolderIcon />} />
          </BottomNavigation>
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
        <Badge color="secondary" badgeContent={10} >
            
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