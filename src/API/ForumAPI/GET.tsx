import { Account, Creator } from "../../Interfaces/UserInterface.tsx";
import axios from "axios";

const typeoftopicurl = `${process.env.REACT_APP_API_URL}/Forum/typeTopic`;
const topicurl = `${process.env.REACT_APP_API_URL}/Forum/topic/`;
const forumurl = `${process.env.REACT_APP_API_URL}/Forum/`;
const threadurl = `${process.env.REACT_APP_API_URL}/Forum/thread/`;

export interface APITypeOfTopic {
  typeName: string;
  typeID: number;
}

export interface APITopic {
  avatarURL: string | null;
  totalThread: number;
  description: string;
  title: string;
  dateCreated: string;
  userName: string | null;
  typeID: number;
  topicID: number;
  userID: number;
}

export interface APIThread {
  threadID: number;
  titleThread: string;
  threadDescription: string;
  likes: number;
  comments: number;
  dateCreated: string;
  topicID: number;
  userID: number;
}

export async function GetTypesOfTopic() {
  try {
    const response = await axios.get(typeoftopicurl);
    return response.data as APITypeOfTopic[];
  } catch (err) {
    console.log("Error getting types of topic:", err);
    return [];
  }
}

export async function GetTopics(typeID: number) {
  try {
    const response = await axios.get(topicurl + typeID);
    return response.data as APITopic[];
  } catch (err) {
    console.log("Error getting topics:", err);
    return [];
  }
}

export async function GetTopicById(topicID: string) {
  try {
    console.log("Getting topic details for ID:", topicID);
    const response = await axios.get(`${topicurl}title/${topicID}`);
    console.log("Topic details response:", response.data);
    return response.data as APITopic;
  } catch (err) {
    console.error("Error getting topic details:", err);
    if (axios.isAxiosError(err)) {
      console.error("API Error details:", err.response?.data);
    }
    return null;
  }
}

export async function GetListThread(topicID: string) {
  try {
    console.log("Getting threads for topicID:", topicID);
    const response = await axios.get(`${forumurl}${topicID}/GetThread`);
    console.log("Thread API response:", response.data);
    return response.data as APIThread[];
  } catch (err) {
    console.error("Error getting threads:", err);
    if (axios.isAxiosError(err)) {
      console.error("API Error details:", err.response?.data);
    }
    return [];
  }
}

export async function GetThreadByID(threadID: string) {
  try {
    console.log("Getting thread details for ID:", threadID);
    const response = await axios.get(`${threadurl}${threadID}`);
    console.log("Thread details response:", response.data);
    return response.data as APIThread;
  } catch (err) {
    console.error("Error getting thread details:", err);
    if (axios.isAxiosError(err)) {
      console.error("API Error details:", err.response?.data);
    }
    return null;
  }
}

export async function CheckLikeStatus(userID: number, threadID: number) {
  try {
    const response = await axios.get(`${threadurl}like/${userID}/${threadID}`);
    return response.data; // Trả về true/false
  } catch (error) {
    return false;
  }
}

export const GetLikeCount = async (threadID: number) => {
  try {
    const response = await fetch(`${threadurl}likecount/${threadID}`);
    if (response.ok) {
      return await response.json(); // số lượng like
    }
    console.error("Failed to get like count");
    return 0;
  } catch (error) {
    console.error("Error getting like count:", error);
    return 0;
  }
};
