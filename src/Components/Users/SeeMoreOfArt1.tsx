import React, { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../Themes/ThemeProvider.tsx';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import '../../css/SeeMoreOfArt1.css';
import Pagination from '@mui/material/Pagination';
import { GetArtList } from '../../API/ArtworkAPI/GET.tsx';
import { Artwork } from '../../Interfaces/ArtworkInterfaces';
import { PlaceHoldersImageCard } from './PlaceHolders.jsx';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
export default function SeeMoreOfArt1() {
  const { theme } = useContext(ThemeContext)
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 30;
  const [artworkList, SetArtworkList] = useState<Artwork[]>([])

  const redirect = useNavigate()

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  }

  useEffect(() => {
    const getArtworks = async () => {
      let artworkList: Artwork[] | undefined = await GetArtList()
      //SetArtworkList(artworkList? artworkList:[])
      const indexOfLastImage = currentPage * imagesPerPage;
      const indexOfFirstImage = indexOfLastImage - imagesPerPage;
      const currentImages = artworkList?.slice(indexOfFirstImage, indexOfLastImage);
      SetArtworkList(currentImages ? currentImages : [])
    }
    getArtworks()
  }, [])

  // const handleClick = (artworkID) => {
  //   redirect(`../artwork/${artworkID}`)
  // }

  function ArtWorkList() {
    return (
      <>
        <ImageList variant="masonry" cols={4}>
          {artworkList.map((work: Artwork) => (
            <Link key={work.artworkID} to={`artwork/${work.artworkID}`}>
              <ImageListItem key={work.artworkID}>
                {work.purchasable ?
                  <AttachMoneyIcon style={{
                    position: 'absolute',
                    backgroundColor: 'green', // Hex code for a yellow color
                    color: 'white', // Icon color
                    borderRadius: '50%', // Makes the background rounded
                    padding: 'auto', // Adjust padding to manage the size of the rounded background
                    margin: '5px', // Make the icon floating inside the image
                    fontSize: '40px', // Adjust the size of the icon as needed
                    // Add other styling properties as required for your specific icon
                    bottom: 0,
                    right: 0,
                    zIndex: 2 // Ensure it's above the image
                  }}
                    fontSize='large'
                  />
                  : ""}
                <img
                  style={{ cursor: 'pointer' }}
                  // onClick={() => handleClick(work.artworkID)}
                  src={work.imageFile}
                  alt={work.artworkName}
                  loading="lazy"
                />
              </ImageListItem></Link>
          ))}
        </ImageList>
      </>
    )
  }

  return (
    <div className='seemorecommentwork' style={{ paddingTop: "2%", paddingBottom: '5%' }}>
      <Box className='box'
        sx={{
          color: theme.color,
          backgroundColor: `rgba(${theme.rgbBackgroundColor},0.97)`,
          transition: theme.transition,
          width: '95%',
          margin: 'auto',
          borderRadius: '5px',
        }}>
        <div className='content-recomment'>
          <Typography variant='h5'>Recommended Works:</Typography>

          <div className='listimage'>
            <Box className='boxlistimage'>
              {artworkList.length !== 0 ? <ArtWorkList /> : <PlaceHoldersImageCard />}
            </Box>
          </div></div>
        <div className='pagination'>

        </div>

      </Box>
    </div>
  )
}
