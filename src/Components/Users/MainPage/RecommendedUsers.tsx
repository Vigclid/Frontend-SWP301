import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea, Typography } from '@mui/material';
import { Creator } from '../../../Interfaces/UserInterface.ts';
import { PlaceHoldersImageCard } from '../PlaceHolders.jsx';
import axios from 'axios';

export default function RecommendedUsers() {
  const [hoveredID, setHoveredID] = useState<number | null>(null);
  const [users, setUsers] = useState<Creator[]>([]);
  console.log('Users:', users);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:7233/api/Creator/top-popular');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching top users:', error);
      }
    };

    fetchUsers();
  }, []);

  function RecommendedUserList() {
    return (
      <>
        <ImageList className='recommendedUsers' cols={5}>
          {users.map((user) => (
            <Link key={user.accountId} to={`/characters/profile/${user.accountId}`}>
              <CardActionArea
                onMouseEnter={() => setHoveredID(user.userId)}
                onMouseLeave={() => setHoveredID(null)}
              >
                <ImageListItem style={{ position: 'relative' }}>
                  {/* Hình đại diện */}
                  <CardMedia
                    component="img"
                    style={{
                      pointerEvents: 'none',
                      objectFit: 'cover',
                      width: '15vw',
                      height: '15vw',
                      borderRadius: '50%',
                      minWidth: '182px',
                      minHeight: '182px',
                    }}
                    image={user.profilePicture && user.profilePicture.length > 0 ? user.profilePicture : "/images/default-avatar.png"}
                    alt={`${user.firstName} ${user.lastName}`}
                    loading="lazy"
                  />

                  {/* Hiển thị thông tin khi di chuột vào */}
                  {hoveredID === user.userId && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: 'white',
                        textAlign: 'center',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                        zIndex: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        padding: '10px',
                        borderRadius: '10px',
                      }}
                    >
                      <div>{`${user.firstName} ${user.lastName}`}</div>
                      <div>Followers: {user.followerCount}</div>
                    </div>
                  )}
                </ImageListItem>
              </CardActionArea>
            </Link>
          ))}
        </ImageList>
      </>
    );
  }

  return (
    <>
      <div className='headrecommended'>
        <Typography variant='h5'>
          Recommended Users
        </Typography>
        <Link to={`/top-users`}>
          <div className='seemore'>See More</div>
        </Link>
      </div>
      <div className='recommendedimg'>
        {users.length !== 0 ? <RecommendedUserList /> : <PlaceHoldersImageCard />}
      </div>
    </>
  );
}
