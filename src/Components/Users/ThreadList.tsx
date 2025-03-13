import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Card, CardContent, Grid, Avatar, Button } from "@mui/material";
import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import { GetListThread, GetTopicById, APIThread, APITopic } from "../../API/ForumAPI/GET.tsx";
import ThreadUpload from "./ThreadUpload.tsx";
import { GetCreatorByID } from "../../API/UserAPI/GET.tsx";
import { Creator } from "../../Interfaces/UserInterface.tsx";
import "../../css/Forum.css";

const getTimeDifference = (dateCreated: string): string => {
  try {
    const now = new Date();
    const createdDate = new Date(dateCreated);
    if (isNaN(createdDate.getTime())) {
      return "N/A";
    }

    const diffInSeconds = Math.floor((now.getTime() - createdDate.getTime()) / 1000);

    if (diffInSeconds < 0) return "Future post";
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  } catch (error) {
    console.error("Error calculating time difference:", error);
    return "N/A";
  }
};

interface ThreadCardProps {
  thread: APIThread;
  creator: Creator;
  topicID: number;
}

const ThreadCard = ({ thread, creator, topicID }: ThreadCardProps) => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/characters/forum/${topicID}/${thread.threadID}`)}
      className="thread-card"
      sx={{ backgroundColor: `rgba(${theme.rgbBackgroundColor}, 0.8)` }}>
      <CardContent className="thread-content">
        <Grid container spacing={2}>
          <Grid item xs={7}>
            <div className="thread-main-content">
              <Typography className="thread-title" sx={{ color: theme.color }}>
                {thread.titleThread}
              </Typography>
              <Typography className="thread-description" sx={{ color: theme.color }}>
                {thread.threadDescription}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={2}>
            <Typography className="thread-stats" sx={{ color: theme.color }}>
              {thread.comments} replies
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <div className="thread-author">
              <Avatar src={creator?.profilePicture} className="thread-author-avatar" />
              <div className="thread-author-info">
                <Typography className="thread-author-name" sx={{ color: theme.color }}>
                  {creator?.firstName + " " + creator?.lastName || "Unknown"}
                </Typography>
                <Typography className="thread-time" sx={{ color: theme.color }}>
                  {getTimeDifference(thread.dateCreated)}
                </Typography>
              </div>
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const ThreadList = () => {
  const { theme } = useContext(ThemeContext);
  const { topicID } = useParams<{ topicID: string }>();
  const [threads, setThreads] = useState<APIThread[]>([]);
  const [creators, setCreators] = useState<{ [key: number]: Creator }>({});
  const [topic, setTopic] = useState<APITopic | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Get user data directly from sessionStorage
  const authData = sessionStorage.getItem("auth");
  const user: Creator = authData ? JSON.parse(authData) : null;

  useEffect(() => {
    const loadData = async () => {
      if (!topicID) return;
      try {
        const topicData = await GetTopicById(topicID);
        if (topicData) {
          setTopic(topicData);
        }

        const threadsData = await GetListThread(topicID);
        if (threadsData && Array.isArray(threadsData)) {
          setThreads(threadsData);

          const creatorPromises = threadsData.map((thread) => GetCreatorByID(thread.userID.toString()));
          const creatorResults = await Promise.all(creatorPromises);
          const creatorMap: { [key: number]: Creator } = {};
          creatorResults.forEach((creator, index) => {
            if (creator) {
              creatorMap[threadsData[index].userID] = creator;
            }
          });
          setCreators(creatorMap);
        }
      } catch (error) {
        console.error("Error loading threads:", error);
        setThreads([]);
      }
    };

    loadData();
  }, [topicID]);

  const refreshThreads = async () => {
    if (!topicID) return;
    const threadsData = await GetListThread(topicID);
    if (threadsData && Array.isArray(threadsData)) {
      setThreads(threadsData);
      const creatorPromises = threadsData.map((thread) => GetCreatorByID(thread.userID.toString()));
      const creatorResults = await Promise.all(creatorPromises);
      const creatorMap: { [key: number]: Creator } = {};
      creatorResults.forEach((creator, index) => {
        if (creator) {
          creatorMap[threadsData[index].userID] = creator;
        }
      });
      setCreators(creatorMap);
    }
  };

  if (!topicID) {
    return (
      <Box sx={{ backgroundColor: theme.backgroundColor }} className="empty-state">
        <Typography variant="h4" sx={{ color: theme.color }}>
          Topic not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="forum-container" sx={{ backgroundColor: theme.backgroundImage }}>
      <img src="/images/ForumBanner.png" alt="banner" className="forum-banner" />
      <Box className="forum-content" sx={{ backgroundColor: `rgba(${theme.rgbBackgroundColor}, 0.8)` }}>
        <div className="thread-header">
          <Typography variant="h4" className="thread-title" sx={{ color: theme.color }}>
            {topic?.title || `Topic ${topicID}`}
          </Typography>
          {user ? (
            <Button
              variant="contained"
              onClick={() => setIsUploadOpen(true)}
              className="create-thread-btn"
              sx={{
                backgroundColor: theme.color,
                color: theme.backgroundColor,
                "&:hover": {
                  backgroundColor: theme.color,
                  opacity: 0.9,
                },
              }}>
              Create Thread
            </Button>
          ) : (
            <Typography sx={{ color: theme.color, opacity: 0.7 }}>Please log in to create threads</Typography>
          )}
        </div>

        <ThreadUpload
          open={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          refreshThreads={refreshThreads}
          topicID={parseInt(topicID)}
        />

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={7}>
            <Typography variant="subtitle1" sx={{ color: theme.color }}>
              Thread
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="subtitle1" sx={{ color: theme.color, textAlign: "center" }}>
              Replies
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="subtitle1" sx={{ color: theme.color }}>
              Author
            </Typography>
          </Grid>
        </Grid>

        <div className="thread-list-container">
          {threads.length > 0 ? (
            threads.map((thread) => (
              <ThreadCard
                key={thread.threadID}
                thread={thread}
                creator={creators[thread.userID]}
                topicID={parseInt(topicID)}
              />
            ))
          ) : (
            <Typography className="empty-state" sx={{ color: theme.color }}>
              No threads found for this topic
            </Typography>
          )}
        </div>
      </Box>
    </Box>
  );
};

export default ThreadList;
