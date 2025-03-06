import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, Card, CardContent, Grid, Avatar } from "@mui/material";
import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import { GetTypesOfTopic, GetTopics, APITypeOfTopic, APITopic } from "../../API/ForumAPI/GET.tsx";
import { GetCreatorByID } from "../../API/UserAPI/GET.tsx";
import { Creator } from "../../Interfaces/UserInterface.tsx";
import { useNavigate } from "react-router-dom";
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

interface TopicCardProps {
  topic: APITopic;
  onClick: () => void;
  topicUsers: { [key: number]: Creator };
}

const TopicCard = ({ topic, onClick, topicUsers }: TopicCardProps) => {
  const { theme } = useContext(ThemeContext);
  const topicUser = topicUsers[topic.userID];

  return (
    <Card onClick={onClick} className="topic-card" sx={{ backgroundColor: `rgba(${theme.rgbBackgroundColor}, 0.8)` }}>
      <CardContent className="topic-card-content">
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={5}>
            <Box>
              <Typography className="topic-title" sx={{ color: theme.color }}>
                {topic.title}
              </Typography>
              <Typography className="topic-description" sx={{ color: theme.color }}>
                {topic.description}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Typography className="topic-stats" sx={{ color: theme.color }}>
              {topic.totalThread}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <div className="topic-author">
              <Avatar src={topicUser?.profilePicture} className="author-avatar" />
              <div className="author-info">
                <Typography className="author-name" sx={{ color: theme.color }}>
                  {topicUser?.firstName + " " + topicUser?.lastName || "Unknown"}
                </Typography>
                <Typography className="post-time" sx={{ color: theme.color }}>
                  {topic.dateCreated ? getTimeDifference(topic.dateCreated) : "N/A"}
                </Typography>
              </div>
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

interface TypeSectionProps {
  type: APITypeOfTopic;
}

const TypeSection = ({ type }: TypeSectionProps) => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [topics, setTopics] = useState<APITopic[]>([]);
  const [topicUsers, setTopicUsers] = useState<{ [key: number]: Creator }>({});

  useEffect(() => {
    const fetchTopicsData = async () => {
      try {
        const topicsData = await GetTopics(type.typeID);
        if (topicsData) {
          setTopics(topicsData);
          const userPromises = topicsData.map((topic) => GetCreatorByID(topic.userID.toString()));
          const users = await Promise.all(userPromises);
          const userMap: { [key: number]: Creator } = {};
          users.forEach((user, index) => {
            if (user) {
              userMap[topicsData[index].userID] = user;
            }
          });
          setTopicUsers(userMap);
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };
    fetchTopicsData();
  }, [type.typeID]);

  return (
    <Box className="forum-section">
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <Typography variant="h5" sx={{ color: theme.color }}>
            {type.typeName}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="subtitle1" sx={{ color: theme.color }}>
            Threads
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="subtitle1" sx={{ color: theme.color }}>
            Latest Poster
          </Typography>
        </Grid>
      </Grid>
      {topics.map((topic) => (
        <TopicCard
          key={topic.topicID}
          topic={topic}
          topicUsers={topicUsers}
          onClick={() => navigate(`/characters/forum/${topic.topicID}`)}
        />
      ))}
    </Box>
  );
};

const ForumPage = () => {
  const { theme } = useContext(ThemeContext);
  const [types, setTypes] = useState<APITypeOfTopic[]>([]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const typesData = await GetTypesOfTopic();
        if (typesData) {
          setTypes(typesData);
        }
      } catch (error) {
        console.error("Error fetching types:", error);
      }
    };
    fetchTypes();
  }, []);

  return (
    <Box className="forum-container" sx={{ backgroundColor: theme.backgroundImage }}>
      <img src="/images/ForumBanner.png" alt="banner" className="forum-banner" />
      <Box className="forum-content" sx={{ backgroundColor: `rgba(${theme.rgbBackgroundColor}, 0.8)` }}>
        {types.map((type) => (
          <TypeSection key={type.typeID} type={type} />
        ))}
      </Box>
    </Box>
  );
};

export default ForumPage;
