import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import { Typography } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { PlaceHoldersImageCard } from '../PlaceHolders.jsx';

export default function RecommendedWords({ artworkList, user }) {
  const [hoveredID, setHoveredID] = useState(null);
  const [creators, setCreators] = useState([]);
  const authData = sessionStorage.getItem('auth');
  // console.log('artworkList:', artworkList);
  // console.log('Auth data:', authData);
  const userid = authData ? JSON.parse(authData) : null;
  console.log('User ID:', userid?.userId);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const response = await axios.get('http://localhost:7233/api/Creator');
        setCreators(response.data);
      } catch (error) {
        console.error('Error fetching creators:', error);
      }
    };

    fetchCreators();
  }, []);


  const getCreatorName = (userID) => {
    const creator = creators.find(creator => creator.userId === userID);
    return creator ? `${creator.firstName} ${creator.lastName}` : "Unknown Author";
  };

  function ReccomendedArts() {
    return (
      <ImageList className='recommendedImages' cols={5}>
        {artworkList.map((work) => (
          <Link
            key={work.artworkID}
            to={`/characters/artwork/${work.artworkID}`}
          >
            <CardActionArea
              onMouseEnter={() => setHoveredID(work.artworkID)}
              onMouseLeave={() => setHoveredID(null)}
            >
              <ImageListItem style={{ position: 'relative' }}>
                {work.purchasable && (
                  <AttachMoneyIcon
                    style={{
                      position: 'absolute',
                      backgroundColor: 'green',
                      color: 'white',
                      borderRadius: '50%',
                      margin: '5px',
                      fontSize: '40px',
                      bottom: 0,
                      right: 0,
                      zIndex: 0,
                    }}
                    fontSize="large"
                  />
                )}

                <CardMedia
                  component="img"
                  style={{
                    pointerEvents: 'none',
                    objectFit: 'cover',
                    width: '15vw',
                    height: '15vw',
                    borderRadius: '5px',
                    minWidth: '182px',
                    minHeight: '182px',
                  }}
                  image={
                    work.imageFile && work.imageFile.length > 0
                      ? work.imageFile
                      : "/images/loadingImages.gif"
                  }
                  alt={work.artworkName}
                  loading="lazy"
                />

                {hoveredID === work.artworkID && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: 'white',
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                      zIndex: 1,
                      opacity: 1,
                      transition: 'opacity 0.3s ease-in-out',
                    }}
                  >
                    {work.artworkName}
                    <div>{getCreatorName(work.creatorID)}</div>
                  </div>
                )}
              </ImageListItem>
            </CardActionArea>
          </Link>
        ))}
      </ImageList>
    );
  }

  return (
    <>
      <div className='headrecommended'>
        <Typography key={user?.accountID} variant='h5'>
          Recommended Artworks {user ? `For You, ${user?.firstName} ${user?.lastName}` : "From The Community"}
        </Typography>
        <Link to={`artwordrecomment`}>
          <div className='seemore'>See More</div>
        </Link>
      </div>
      <div className='recommendedimg'>
        {artworkList.length !== 0 ? <ReccomendedArts /> : <PlaceHoldersImageCard />}
      </div>
    </>
  );
}
