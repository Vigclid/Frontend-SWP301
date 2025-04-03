import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../Themes/ThemeProvider.tsx';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import '../../css/SeeMoreUser.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Avatar from '@mui/material/Avatar';
import { CardActionArea, CardActions, Button } from '@mui/material';
import { GetCreatorList } from '../../API/UserAPI/GET.tsx';
import Pagination from '@mui/material/Pagination';
import { Creator } from '../../Interfaces/UserInterface.ts';
import { PlaceHoldersImageCard } from './PlaceHolders.jsx';
import { useNavigate } from "react-router-dom";


export default function SeeMoreUser() {
  const { theme } = useContext(ThemeContext);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 15;
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const [creatorList, setCreatorList] = useState<Creator[] | undefined>([]);
  const navigate = useNavigate();

  // Lấy thông tin người dùng từ sessionStorage
  const savedAuth = sessionStorage.getItem('auth');
  const savedUser: Creator | null = savedAuth ? JSON.parse(savedAuth) : null;
  const currentUserId = savedUser?.userId; // Giả sử userId là trường chứa ID trong session

  useEffect(() => {
    const getArtList = async () => {
      let creatorList: Creator[] | undefined = await GetCreatorList();
      // Lọc bỏ người dùng có ID trùng với ID trong session
      if (currentUserId && creatorList) {
        creatorList = creatorList.filter((user) => user.userId !== currentUserId);
      }
      setCreatorList(creatorList);
    };
    getArtList();
  }, [currentUserId]); // Thêm currentUserId vào dependency array để useEffect chạy lại nếu ID thay đổi

  const currentUsers = creatorList?.slice(indexOfFirstUser, indexOfLastUser) ?? [];
  let paging = creatorList?.length ? Math.ceil(creatorList.length / usersPerPage) : 0;

  const handleUserClick = (accountId: number) => {
    navigate(`/characters/profile/${accountId}`);
  };

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  function UserList() {
    return (
      <>
        {currentUsers.map((user: Creator) => (
          <Card key={user.accountID} sx={{ width: '30%', marginBottom: '20px' }}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image={user.backgroundPicture ? user.backgroundPicture : `/images/defaultbgr.jpg`}
                alt="No Background Image"
              />
              <CardContent>
                <div
                  className="infouser"
                  onClick={() => handleUserClick(user.accountId)}
                  style={{ cursor: 'pointer' }}
                >
                  <Typography gutterBottom variant="h5" component="div" style={{ marginBottom: '0' }}>
                    <div className="avartar">
                      <Avatar
                        alt="Remy Sharp"
                        src={`${user.profilePicture}`}
                        sx={{ width: 100, height: 100 }}
                        style={{ border: '3px solid white' }}
                      />
                    </div>
                    {user.userName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>{user.firstName} {user.lastName}</strong> <br />
                    Followers: {user.followerCount}
                  </Typography>
                </div>

              </CardContent>
            </CardActionArea>
            <CardActions>
              
            </CardActions>
          </Card>
        ))}
      </>
    );
  }

  return (
    <div className="Box-content">
      <Box
        className="box"
        sx={{
          color: theme.color,
          backgroundColor: `rgba(${theme.rgbBackgroundColor},0.97)`,
          transition: theme.transition,
          width: '95%',
          margin: 'auto',
          borderRadius: '5px',
          marginBottom: '15px',
          paddingTop: '30px',
        }}
      >
        <Typography variant="h5" style={{ marginLeft: '100px' }}>
          Recommended User:
        </Typography>
        <div className="grid-container">
          {creatorList?.length !== 0 ? <UserList /> : <PlaceHoldersImageCard />}
        </div>
        <div className="pagination">
          {creatorList?.length !== 0 ? (
            <Pagination count={paging} variant="outlined" onChange={handleChangePage} />
          ) : (
            ''
          )}
        </div>
      </Box>
    </div>
  );
}