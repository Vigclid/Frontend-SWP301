import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import '../../css/Package.css';
import React, { useContext , useEffect, useState } from 'react';
import {ThemeContext} from '../Themes/ThemeProvider.tsx'
import axios from 'axios'
import { Creator } from '../../Interfaces/UserInterface.ts';


function ChipDepositeCoin({user}) {
  const {theme} = useContext(ThemeContext)
  const [creator, setCreator] = useState<Creator>();

  useEffect(() => {
    const fetchCreatorCoins = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/Creator/` + user.accountId);
        setCreator(response.data);
      } catch (error) {
        console.error("Error fetching creator data:", error);
      }
    };

    if (user?.accountId) fetchCreatorCoins();
  }, [user]); // Chạy lại khi `user` thay đổi
  return (
    <div className="premium-typography">  
      <Chip
        avatar={<Avatar alt="Coins" src="/icons/coin.gif" 
            sx={{ bgcolor: 'transparent' ,
              

            }}
        />}
        label={(creator?.coins ?? 0) + "$"}

        variant = "outlined"
        
        sx={{
            '& .MuiChip-avatar': {
                bgcolor: 'transparent !important', // ghi đè style của container avatar trong Chip
                },
            '& .MuiChip-label': {
            color: theme.color5,       // Thay đổi màu chữ
            fontWeight: 'normal',  // Đổi kiểu chữ in đậm
            fontSize: '1rem', 
            transition: theme.transition,
            },
            transition: 'padding 0.3s ease', // chuyển đổi mượt khi padding thay đổi
            '&:hover': {
              paddingRight: '15px', 
            },
            '&:hover::after': {
              content: '"💸"',
              position: 'absolute',
              right: '10px', 
              top: '50%',
              transform: 'translateY(-50%)',
              color: theme.color5,
              fontWeight: 'bold',
              fontSize: '1rem',
            },
        }}
        color = "secondary"
        />      
    </div>
  );
}
export default ChipDepositeCoin;