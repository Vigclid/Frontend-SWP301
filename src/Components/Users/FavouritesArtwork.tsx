import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import "../../css/SeeMoreOfArt1.css";
import { GetFavouritesArtworks } from "../../API/ArtworkAPI/GET.tsx";
import { Artwork } from "../../Interfaces/ArtworkInterfaces";
import { PlaceHoldersImageCard } from "./PlaceHolders.jsx";
import { Link } from "react-router-dom";

interface FavouritesArtworkProps {
  userId?: number;
}

export default function FavouritesArtwork({ userId }: FavouritesArtworkProps) {
  const { theme } = useContext(ThemeContext);
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 30;
  const [artworkList, SetArtworkList] = useState<Artwork[]>([]);

  // Retrieve userId from session storage if not provided as a prop
  const savedAuth = sessionStorage.getItem("auth");
  const userInSession = savedAuth ? JSON.parse(savedAuth) : null;
  const effectiveUserId = userId || userInSession?.userId;

  useEffect(() => {
    const getArtworks = async () => {
      if (effectiveUserId) {
        console.log("Fetching favourites for userId:", effectiveUserId);
        let artworkList = await GetFavouritesArtworks(effectiveUserId);
        console.log("Artworks received:", artworkList);
        const indexOfLastImage = currentPage * imagesPerPage;
        const indexOfFirstImage = indexOfLastImage - imagesPerPage;
        const currentImages = artworkList?.slice(indexOfFirstImage, indexOfLastImage);
        SetArtworkList(currentImages ? currentImages : []);
      }
    };
    getArtworks();
  }, [currentPage, effectiveUserId]);

  function ArtWorkList() {
    return (
      <ImageList variant="masonry" cols={4}>
        {artworkList.map((work) => (
          <Link key={work.artworkID} to={`/characters/artwork/${work.artworkID}`}>
            <ImageListItem key={work.artworkID}>
              {work.purchasable ? (
                <AttachMoneyIcon
                  style={{
                    position: "absolute",
                    backgroundColor: "green",
                    color: "white",
                    borderRadius: "50%",
                    padding: "5px",
                    margin: "5px",
                    fontSize: "40px",
                    bottom: 0,
                    right: 0,
                    zIndex: 2,
                  }}
                  fontSize="large"
                />
              ) : (
                ""
              )}
              <img style={{ cursor: "pointer" }} src={work.imageFile} alt={work.artworkName} loading="lazy" />
            </ImageListItem>
          </Link>
        ))}
      </ImageList>
    );
  }

  return (
    <div className="seemorecommentwork" style={{ paddingTop: "2%", paddingBottom: "5%" }}>
      <Box
        className="box"
        sx={{
          color: theme.color,
          backgroundColor: `rgba(${theme.rgbBackgroundColor},0.97)`,
          transition: theme.transition,
          width: "95%",
          margin: "auto",
          borderRadius: "5px",
        }}>
        <div className="content-recomment">
          <Typography variant="h5">Favourite Artwork:</Typography>
          <div className="listimage">
            <Box className="boxlistimage">{artworkList.length !== 0 ? <ArtWorkList /> : <PlaceHoldersImageCard />}</Box>
          </div>
        </div>
      </Box>
    </div>
  );
}
