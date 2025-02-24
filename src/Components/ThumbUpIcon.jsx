import React, { useEffect, useRef, useState, useContext } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import { ThemeContext } from "./Themes/ThemeProvider.tsx";
import { ToggleThumbUp } from "../API/ArtworkAPI/POST.tsx";
import { CheckThumbUpStatus } from "../API/ArtworkAPI/GET.tsx";

export default function ThumbUpIconComponent({ userID, artworkID }) {
  const { theme } = useContext(ThemeContext);
  const [isThumbUpClicked, setIsThumbUpClicked] = useState(false);
  const spansRef = useRef([]);

  useEffect(() => {
    // Handle ThumbUp Click
    const handleThumbUpClick = async () => {
      const result = await ToggleThumbUp(userID, artworkID);
      if (result) {
        setIsThumbUpClicked((prev) => !prev);
      }
    };

    const thumbUpBtn = document.getElementById("thumbUpBtn");
    thumbUpBtn.addEventListener("click", handleThumbUpClick);

    return () => {
      thumbUpBtn.removeEventListener("click", handleThumbUpClick);
    };
  }, [userID, artworkID]);

  useEffect(() => {
    const fetchThumbUpStatus = async () => {
      if (userID && artworkID) {
        const status = await CheckThumbUpStatus(userID, artworkID);
        setIsThumbUpClicked(status);
      }
    };
    fetchThumbUpStatus();
  }, [userID, artworkID]);

  useEffect(() => {
    // Handle animation for ThumbUp button
    if (isThumbUpClicked) {
      for (const span of spansRef.current) {
        span.classList.add("anim-thumbup");
      }
      setTimeout(() => {
        for (const span of spansRef.current) {
          span.classList.remove("anim-thumbup");
        }
      }, 700);
    }
  }, [isThumbUpClicked]);

  return (
    <div className="hero">
      <div className="button-thumbup">
        <button
          style={{ display: "flex" }}
          className={`btn btn-thumbup ${isThumbUpClicked ? "active" : ""}`}
          id="thumbUpBtn">
          {isThumbUpClicked ? (
            <ThumbUpIcon sx={{ fontSize: 35 }} style={{ color: "#32edce" }} />
          ) : (
            <ThumbUpOffAltIcon sx={{ color: theme.color, backgroundColor: "none", fontSize: 35 }} />
          )}
          {Array.from({ length: 16 }).map((_, index) => (
            <span key={index} ref={(el) => (spansRef.current[index] = el)}></span>
          ))}
          <h4 className="addthumbup" style={{ paddingTop: "5px", color: isThumbUpClicked ? "#32edce" : theme.color }}>
            {isThumbUpClicked ? "Thanks For The Thumb Up!" : "Give a Thumb Up"}
          </h4>
        </button>
      </div>
    </div>
  );
}
