import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Card, CardContent, Grid, Avatar, CircularProgress } from "@mui/material";
import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import { GetThreadByID, APIThread } from "../../API/ForumAPI/GET.tsx";
import { GetCreatorByID } from "../../API/UserAPI/GET.tsx";
import { Creator } from "../../Interfaces/UserInterface.ts";
import "../../css/Thread.css";
import LikeIconThread from "../LikeIconThread.jsx";
import CommentsThread from "../CommentsThread.jsx";

const getTimeDifference = (dateCreated: string) => {
  try {
    const now = new Date();
    const createdDate = new Date(dateCreated);
    if (isNaN(createdDate.getTime())) {
      console.warn(`Invalid Date string: ${dateCreated}`);
      return "N/A";
    }

    const diffInSeconds = Math.floor((now.getTime() - createdDate.getTime()) / 1000);

    if (diffInSeconds < 0) {
      return "Future post";
    }

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minutes ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hours ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} days ago`;
    } else {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months} months ago`;
    }
  } catch (error) {
    console.error("Error calculating time difference:", error);
    return "N/A";
  }
};

const ThreadPage = () => {
  const { theme } = useContext(ThemeContext);
  const { topicID, threadId } = useParams<{ topicID: string; threadId: string }>();
  const [thread, setThread] = useState<APIThread | null>(null);
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const savedAuth = sessionStorage.getItem("auth");
  const savedUser: Creator = savedAuth ? JSON.parse(savedAuth) : null;

  useEffect(() => {
    const loadThreadAndCreator = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!threadId) {
          throw new Error("Thread ID is required");
        }

        const threadData = await GetThreadByID(threadId);
        if (!threadData) {
          throw new Error("Thread not found");
        }

        setThread(threadData);

        const creatorData = await GetCreatorByID(threadData.userID.toString());
        if (creatorData) {
          setCreator(creatorData);
        }
      } catch (err) {
        console.error("Error loading thread:", err);
        setError(err instanceof Error ? err.message : "An error occurred while loading the thread");
      } finally {
        setLoading(false);
      }
    };

    loadThreadAndCreator();
  }, [threadId]);

  if (loading) {
    return (
      <Box
        sx={{
          backgroundColor: theme.backgroundColor,
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !thread) {
    return (
      <Box
        sx={{
          backgroundColor: theme.backgroundColor,
          minHeight: "100vh",
          p: 3,
        }}>
        <Typography variant="h4" sx={{ color: theme.color }}>
          {error || "Thread not found"}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: theme.backgroundImage, position: "relative", minHeight: "100vh", p: 3 }}>
      <Box className="thread-page-container" sx={{ backgroundColor: `rgba(${theme.rgbBackgroundColor}, 0.8)` }}>
        <div className="thread-header">
          <Typography className="thread-title" sx={{ color: theme.color }}>
            {thread.titleThread}
          </Typography>
          <div className="thread-metadata">
            <Typography sx={{ color: theme.color }}>{getTimeDifference(thread.dateCreated)}</Typography>
          </div>
        </div>

        <div className="thread-creator-section">
          <Avatar src={creator?.profilePicture || "/images/anon.jpg"} className="thread-creator-avatar" />
          <div className="thread-creator-info">
            <Typography className="thread-creator-name" sx={{ color: theme.color }}>
              {creator?.firstName + " " + creator?.lastName || "Unknown"}
            </Typography>
            <Typography className="thread-content" sx={{ color: theme.color }}>
              {thread.threadDescription}
            </Typography>
          </div>
        </div>

        <div className="thread-stats">
          <div className="thread-stat-item">
            {/* <Typography className="thread-stat-label" sx={{ color: theme.color }}>
              Likes
            </Typography>
            <Typography className="thread-stat-value" sx={{ color: theme.color }}>
              {thread.likes}
            </Typography> */}

            {savedUser ? (<LikeIconThread userID={creator?.userId} threadID={thread.threadID} />) : "" }
          </div>
          <div className="thread-stat-item">
            <Typography className="thread-stat-label" sx={{ color: theme.color }}>
              Comments
            </Typography>
            <Typography className="thread-stat-value" sx={{ color: theme.color }}>
              {thread.comments}
            </Typography>
          </div>
        </div>

        {/* Comments section placeholder */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography sx={{ color: theme.color, opacity: 0.7 }}>Comments functionality coming soon...</Typography>
        </Box>
        <Box sx={{ mt: 4 }}>
          <CommentsThread />
        </Box>
      </Box>
    </Box>
  );
};

export default ThreadPage;
