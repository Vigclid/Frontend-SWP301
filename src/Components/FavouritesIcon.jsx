import React, { useEffect, useRef, useState, useContext } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { ThemeContext } from "./Themes/ThemeProvider.tsx";
import { ToggleFavourite } from "../API/ArtworkAPI/POST.tsx";
import { CheckFavouriteStatus } from "../API/ArtworkAPI/GET.tsx";

export default function TestIcon({ userID, artworkID }) {
  const { theme } = useContext(ThemeContext);
  const [isClicked, setIsClicked] = useState(false);
  const spansRef = useRef([]);

  useEffect(() => {
    // Handle Favourite Click
    const handleClick = async () => {
      const result = await ToggleFavourite(userID, artworkID);
      if (result) {
        setIsClicked((prev) => !prev);
      }
    };

    const btn = document.getElementById("btn");
    btn.addEventListener("click", handleClick);

    return () => {
      btn.removeEventListener("click", handleClick);
    };
  }, [userID, artworkID]);

  useEffect(() => {
    const fetchFavouriteStatus = async () => {
      if (userID && artworkID) {
        const status = await CheckFavouriteStatus(userID, artworkID);
        setIsClicked(status);
      }
    };
    fetchFavouriteStatus();
  }, [userID, artworkID]);

  useEffect(() => {
    // Handle animation for Favourite button
    if (isClicked) {
      for (const span of spansRef.current) {
        span.classList.add("anim");
      }
      setTimeout(() => {
        for (const span of spansRef.current) {
          span.classList.remove("anim");
        }
      }, 700);
    }
  }, [isClicked]);

  return (
    <div className="hero">
      <div className="button-favourite">
        <button style={{ display: "flex" }} className={`btn ${isClicked ? "active" : ""}`} id="btn">
          {isClicked ? (
            <FavoriteIcon sx={{ fontSize: 35 }} style={{ color: "#ff1876" }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: theme.color, backgroundColor: "none", fontSize: 35 }} />
          )}
          {Array.from({ length: 16 }).map((_, index) => (
            <span key={index} ref={(el) => (spansRef.current[index] = el)}></span>
          ))}
          <h4 className="addfavourite" style={{ paddingTop: "5px", color: isClicked ? "#ff1876" : theme.color }}>
            {isClicked ? "Thanks For Your Love" : "Add To Favourites"}
          </h4>
        </button>
      </div>
    </div>
  );
}
