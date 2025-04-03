import React, { useState, useEffect, useCallback } from "react";
import { GetCreatorByID } from "../API/UserAPI/GET.tsx";
import { GetCurrentPackageByAccountID } from "../API/PackageAPI/GET.tsx";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import CustomizedButton from "./StyledMUI/CustomizedButton.tsx";
import CustomizedTextField from "./StyledMUI/CustomizedTextField.tsx";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "../css/Comment.css"; // Import CSS file
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { RankEffect } from "./StyledMUI/RankEffect.tsx";

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [threadID, setThreadID] = useState(null);
  const [replyComments, setReplyComments] = useState([]);

  useEffect(() => {
    // Get threadID from URL
    const pathParts = window.location.pathname.split("/");
    const id = pathParts[pathParts.length - 1];
    setThreadID(id); // Set the threadID

    if (id) {
      const fetchComments = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/Forum/thread/comments/${id}`);
          setComments(response.data);
        } catch (error) {
          console.error("Error fetching comments:", error);
          setComments([]);
        }
      };

      const fetchReplyComments = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/replycomment`);
          setReplyComments(response.data);
        } catch (error) {
          console.error("Error fetching reply comments:", error);
          setReplyComments([]);
        }
      };

      fetchComments();
      fetchReplyComments();
    }
  }, []);

  const filteredComments = comments.filter((comment) => comment.threadID == threadID);
  const getReplyCommentsByCommentID = (commentID) => replyComments.filter((reply) => reply.commentID === commentID);

  const onComment = (newComment) => setComments((prev) => [newComment, ...prev]);

  return (
    <div className="comments-container">
      <h2>Comments</h2>
      <div className="inputcomment">
        <CommentInput onComment={onComment} threadID={threadID} setComments={setComments} />
      </div>
      <div className="comments-list">
        {filteredComments.map((comment, index) => (
          <CommentItem
            key={index}
            comment={comment}
            getReplyCommentsByCommentID={getReplyCommentsByCommentID}
            threadID={threadID}
          />
        ))}
      </div>
    </div>
  );
}

const CommentItem = ({ comment, getReplyCommentsByCommentID, threadID }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [newReply, setNewReply] = useState("");
  const [replyComments, setReplyComments] = useState([]);

  useEffect(() => {
    const replies = getReplyCommentsByCommentID(comment.commentID);
    setReplyComments(replies);
  }, [comment.commentID]);

  const onReplyComment = async () => {
    const authData = sessionStorage.getItem("auth");
    const user = authData ? JSON.parse(authData) : null;

    if (!user) {
      alert("Please log in to continue...");
      return;
    }

    const newReplyData = {
      body: newReply,
      commentID: comment.commentID,
      replierID: user.userId,
      commentDetail: newReply,
      dateOfInteract: new Date().toISOString(),
    };

    try {
      // Gửi phản hồi bình luận
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/replycomment/add`, newReplyData, {
        headers: { "Content-Type": "application/json" },
      });

      // Cập nhật danh sách phản hồi
      setReplyComments((prevReplies) => [response.data, ...prevReplies]);
      setNewReply("");

      // Cập nhật số lượng bình luận
      await axios.put(`${process.env.REACT_APP_API_URL}/Forum/update-comment-count/${threadID}`);
    } catch (error) {
      console.error("Error posting reply comment:", error);
    }
  };

  return (
    <div className="comment-card glass-card">
      <div className="comment-content">
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <CommentUser userID={comment.userID} />
          <Typography style={{ marginLeft: "50px" }}>{comment.commentDetail}</Typography>
        </div>
        {isReplying ? (
          <CustomizedButton
            variant="contained"
            size="small"
            onClick={() => setIsReplying(false)}
            className="reply-button">
            Cancel
          </CustomizedButton>
        ) : (
          <CustomizedButton
            variant="contained"
            size="small"
            onClick={() => setIsReplying(true)}
            className="reply-button">
            Reply
          </CustomizedButton>
        )}
      </div>
      <div className="replies">
        {isReplying && (
          <div className="reply-input">
            <CustomizedTextField
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder="Reply to this comment..."
            />
            <Button onClick={onReplyComment} className="submit-button">
              Submit
            </Button>
          </div>
        )}
        {replyComments.map((reply, index) => (
          <div key={index} className="reply-card glass-card">
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <CommentUser userID={reply.replierID} size={35} />
              <Typography style={{ marginLeft: "45px" }}>{reply.commentDetail}</Typography>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function CommentInput({ threadID, setComments }) {
  const [commentBody, setCommentBody] = useState("");

  const formik = useFormik({
    initialValues: {
      commentDetail: "",
    },
    validationSchema: Yup.object({
      commentDetail: Yup.string().required("Comment cannot be empty"),
    }),
    onSubmit: async (values) => {
      const authData = sessionStorage.getItem("auth");
      const user = authData ? JSON.parse(authData) : null;

      if (!user) {
        alert("Please log in to continue...");
        return;
      }

      const commentData = {
        commentDetail: values.commentDetail,
        threadID: threadID,
        userID: user.userId,
        createdDate: new Date().toISOString(),
      };

      formik.values.commentDetail = "";
      console.log("Comment data:", commentData);

      try {
        // Gửi bình luận
        await axios.post(`${process.env.REACT_APP_API_URL}/Forum/thread/comments/`, commentData, {
          headers: { "Content-Type": "application/json" },
        });

        // Cập nhật số lượng bình luận
        await axios.put(`${process.env.REACT_APP_API_URL}/Forum/update-comment-count/${threadID}`);

        // Lấy danh sách bình luận cập nhật
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/Forum/thread/comments/${threadID}`);
        setComments(response.data);

        // Reset form sau khi gửi bình luận thành công
        formik.resetForm();
      } catch (error) {
        console.error("Error posting comment:", error);
      }
    },
  });

  return (
    <div className="comment-input-container">
      <form onSubmit={formik.handleSubmit}>
        <CustomizedTextField
          id="comment"
          style={{ width: "100%" }}
          name="commentDetail"
          value={formik.values.commentDetail}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Share your thoughts..."
          error={formik.touched.commentDetail && Boolean(formik.errors.commentDetail)}
          helperText={formik.touched.commentDetail && formik.errors.commentDetail}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1%" }}>
          <CustomizedButton variant="contained" type="submit" endIcon={<SendIcon />} className="submit-button">
            Send
          </CustomizedButton>
        </div>
      </form>
    </div>
  );
}

const CommentUser = ({ userID, size = 40 }) => {
  const [userData, setUserData] = useState({
    name: "Loading...",
    avatar: "/images/anon.jpg",
    accountId: null,
    package: null,
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const creator = await GetCreatorByID(userID);
        if (creator) {
          const userPackage = await GetCurrentPackageByAccountID(creator.accountId);
          console.log("Raw user package data for userID", userID, ":", userPackage); // Debug log

          if (userPackage && typeof userPackage.typeID !== "undefined") {
            const packageData = {
              typeID: Number(userPackage.typeID), // Đảm bảo typeID là số
            };
            console.log("Processed package data:", packageData); // Debug log processed data

            setUserData({
              name: `${creator.firstName} ${creator.lastName}`,
              avatar: creator.profilePicture || "/images/anon.jpg",
              accountId: creator.accountId,
              package: packageData,
            });
          } else {
            console.log("No valid package type found for user", userID);
          }
        }
      } catch (error) {
        console.error("Error loading user:", error);
        setUserData({
          name: "Unknown User",
          avatar: "/images/anon.jpg",
          accountId: null,
          package: null,
        });
      }
    };
    loadUser();
  }, [userID]);

  return (
    <div className="comment-header" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <Box sx={{ position: "relative" }}>
        <Link to={`/characters/profile/${userData.accountId}`} style={{ textDecoration: "none" }}>
          <img
            src={userData.avatar}
            alt="User avatar"
            style={{ width: `${size}px`, height: `${size}px`, borderRadius: "50%", objectFit: "cover" }}
          />
        </Link>
        {userData.package?.typeID && [2, 3, 4, 5].includes(Number(userData.package.typeID)) && (
          <RankEffect type={Number(userData.package.typeID)} />
        )}
      </Box>
      <div>
        <Link to={`/characters/profile/${userData.accountId}`} style={{ textDecoration: "none" }}>
          <Typography sx={{ color: "#FFFFFF", fontWeight: "Bold" }}>{userData.name}</Typography>
        </Link>
      </div>
    </div>
  );
};
