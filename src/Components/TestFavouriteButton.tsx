import React, { useEffect, useState, useContext } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { ThemeContext } from "./Themes/ThemeProvider.tsx";
import { ToggleFavourite } from "../API/ArtworkAPI/POST.tsx";
import { CheckFavouriteStatus } from "../API/ArtworkAPI/GET.tsx"; 

export default function TestFavouriteButton({ userID, artworkID }) {
  const { theme } = useContext(ThemeContext);
  const [isFavourite, setIsFavourite] = useState(false);

  // Kiểm tra trạng thái yêu thích khi component mount
  useEffect(() => {
    const fetchFavouriteStatus = async () => {
      if (userID && artworkID) {
        const status = await CheckFavouriteStatus(userID, artworkID);
        setIsFavourite(status);
      }
    };
    fetchFavouriteStatus();
  }, [userID, artworkID]); // Chạy lại khi userID hoặc artworkID thay đổi

  const handleClick = async () => {
    const result = await ToggleFavourite(userID, artworkID);
    if (result) {
      setIsFavourite((prev) => !prev);
    }
  };

  return (
    <button className="btn" onClick={handleClick} style={{ display: "flex" }}>
      {isFavourite ? (
        <FavoriteIcon sx={{ fontSize: 35 }} style={{ color: "#ff1876" }} />
      ) : (
        <FavoriteBorderIcon sx={{ fontSize: 35, color: theme.color }} />
      )}
      <h4 className="addfavourite" style={{ paddingTop: "5px", color: isFavourite ? "#ff1876" : theme.color }}>
        {isFavourite ? "Thanks For The Like!" : "Add To Favourites"}
      </h4>
    </button>
  );
}