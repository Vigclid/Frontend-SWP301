import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import '../../css/Package.css';
import React, { useContext } from 'react';
import {ThemeContext} from '../Themes/ThemeProvider.tsx'
function ChipDepositeCoin({user}) {
  const {theme} = useContext(ThemeContext)
  return (
    <div className="premium-typography">
      <Chip
        avatar={<Avatar alt="Coins" src="/icons/coin.gif" 
            sx={{ bgcolor: 'transparent' }}
        />}
        label="10.32$"
        variant = "outlined"
        
        sx={{
            '& .MuiChip-avatar': {
                bgcolor: 'transparent !important', // ghi đè style của container avatar trong Chip
                },
            '& .MuiChip-label': {
            color: theme.color5,       // Thay đổi màu chữ
            fontWeight: 'normal',  // Đổi kiểu chữ in đậm
            fontSize: '1rem', 
            transition: theme.transition, // Thay đổi kích thước chữ

            },
        }}
        color = "secondary"
        />      
    </div>
  );
}
export default ChipDepositeCoin;