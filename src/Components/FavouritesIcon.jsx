import React, { useEffect, useRef, useState, useContext } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { ThemeContext } from "./Themes/ThemeProvider.tsx";
import { ToggleFavourite } from "../API/ArtworkAPI/POST.tsx";
import { CheckFavouriteStatus } from "../API/ArtworkAPI/GET.tsx";
import { Sync } from "@mui/icons-material";

export default function FavouritesIcon({ userID, artworkID }) {
  const { theme } = useContext(ThemeContext);
  const [isClicked, setIsClicked] = useState(false);
  const spansRef = useRef([]);

  useEffect(() => {
    // Cái này để handle cho Click
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
  }, []); // Dependency trống để chỉ chạy một lần sau khi render

  useEffect(() => {
    const fetchFavouriteStatus = async () => {
      if (userID && artworkID) {
        const status = await CheckFavouriteStatus(userID, artworkID);
        setIsClicked(status);
      }
    };
    fetchFavouriteStatus();
  }, []);

  useEffect(() => {
    if (isClicked && spansRef.current) {
      // Lưu lại giá trị của spansRef.current vào một biến để dễ sử dụng
      const spans = spansRef.current;
      for (const span of spans) {
        if (span) {
          span.classList.add("anim");
        }
      }
      const timeoutId = setTimeout(() => {
        // Kiểm tra lại trước khi xử lý
        if (spansRef.current) {
          for (const span of spansRef.current) {
            if (span) {
              span.classList.remove("anim");
            }
          }
        }
      }, 700);
      
      // Dọn dẹp timeout khi component unmount hoặc isClicked thay đổi
      return () => clearTimeout(timeoutId);
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
          {/* <FavoriteIcon style={{ color: isClicked ? '#ff1876' : '#000'}} /> */}
          {Array.from({ length: 16 }).map((_, index) => (
            <span key={index} ref={(el) => (spansRef.current[index] = el)}></span>
          ))}

          <h4 className="addfavourite" style={{ paddingTop: "5px", color: isClicked ? "#ff1876" : theme.color }}>
            {isClicked ? "Thanks For Your Love!" : "Add To Favourites"}
          </h4>
        </button>
      </div>
    </div>
  );
}
