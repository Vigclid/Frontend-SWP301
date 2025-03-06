import React, { useEffect, useState, useContext } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import { ThemeContext } from "./Themes/ThemeProvider.tsx";
import { CheckLikeStatus, GetLikeCount } from "../API/ArtworkAPI/GET.tsx";
import { ToggleLike } from "../API/ArtworkAPI/POST.tsx";

export default function LikeIconComponent({ userID, artworkID }) {
  const { theme } = useContext(ThemeContext);
  const [isLikeClicked, setIsLikeClicked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

      // Lấy trạng thái like và số like ban đầu
  useEffect(() => {
    const fetchData = async () => {
      if (userID && artworkID) {
        const status = await CheckLikeStatus(userID, artworkID);
      // Kiểm tra trạng thái like ban đầu
        setIsLikeClicked(status);
        const count = await GetLikeCount(artworkID);
      // Kiểm tra số like ban đầu
        setLikeCount(count);
      }
    };
    fetchData();
  }, [userID, artworkID]);

  // Xử lý sự kiện click like
  const handleLikeClick = async () => {
    const response = await ToggleLike(userID, artworkID);
    console.log("ToggleLike response:", response); // Kiểm tra dữ liệu trả về từ API
    if (response) {
      setIsLikeClicked(response.isLike);
      setLikeCount(response.likeCount);
      console.log("Updated isLikeClicked:", response.isLike); // Giá trị trạng thái mới
      console.log("Updated likeCount:", response.likeCount); // Giá trị số like mới
    }
  };

  return (
    <div className="hero">
      <div className="button-like" style={{ display: "flex", justifyContent: "center" }}>
        <button
          style={{ display: "flex" }}
          className={`btn btn-thumbup ${isLikeClicked ? "active" : ""}`}
          id="thumbUpBtn"
          onClick={handleLikeClick}>
          {isLikeClicked ? (
            <ThumbUpIcon sx={{ fontSize: 35 }} style={{ color: "#32edce" }} />
          ) : (
            <ThumbUpOffAltIcon sx={{ color: theme.color, backgroundColor: "none", fontSize: 35 }} />
          )}
          {/* <h4 className="addthumbup" style={{ paddingTop: "5px", color: isLikeClicked ? "#32edce" : theme.color }}>
            {isLikeClicked ? "Thanks For Your Like!" : "Give a Like"}
          </h4> */}
          <span
            style={{
              marginLeft: "8px",
              color: isLikeClicked ? "#32edce" : theme.color,
              fontSize: "16px",
              display: "inline-block",
            }}>
            {likeCount}
          </span>
        </button>
        {/* Hiển thị số like */}
        <h4 style={{ paddingTop: "13px", color: theme.color, marginLeft: "10px", fontSize: "18px" }}>
          {likeCount} likes
        </h4>
      </div>
    </div>
  );
}
