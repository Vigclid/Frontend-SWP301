import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import CustomizedButton from "./StyledMUI/CustomizedButton.tsx";
import CustomizedTextField from "./StyledMUI/CustomizedTextField.tsx";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "../css/Comment.css"; // Import CSS file
import { Typography } from "@mui/material";

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [creators, setCreators] = useState([]);
  const [artworkID, setArtworkID] = useState(null);
  const [replyComments, setReplyComments] = useState([]);

  useEffect(() => {
    // Get artworkID from URL
    const pathParts = window.location.pathname.split("/");
    const id = pathParts[pathParts.length - 1];
    setArtworkID(id); // Set the artworkID

    // Fetch comments data
    fetch("http://localhost:7233/api/comments/")
      .then((response) => response.json())
      .then((data) => setComments(data))
      .catch((error) => setComments([]));

    // Fetch reply comments data
    fetch("http://localhost:7233/api/replycomment")
      .then((response) => response.json())
      .then((data) => setReplyComments(data))
      .catch((error) => setReplyComments([]));

    // Fetch creators data
    fetch("http://localhost:7233/api/Creator")
      .then((response) => response.json())
      .then((data) => setCreators(data))
      .catch((error) => setCreators([]));
  }, [comments]);

  const getUserNameById = (userID) => {
    const creator = creators.find((creator) => creator.userId === userID);
    return creator ? `${creator.firstName} ${creator.lastName}` : "Unknown User";
  };

  const filteredComments = comments.filter((comment) => comment.artworkID == artworkID);
  const getReplyCommentsByCommentID = (commentID) => replyComments.filter((reply) => reply.commentID === commentID);

  const onComment = (newComment) => setComments((prev) => [newComment, ...prev]);

  return (
    <div className="comments-container">
      <h2>Comments</h2>
      <div className="inputcomment">
        <CommentInput onComment={onComment} artworkID={artworkID} />
      </div>
      <div className="comments-list">
        {filteredComments.map((comment, index) => (
          <CommentItem
            key={index}
            comment={comment}
            getUserNameById={getUserNameById}
            getReplyCommentsByCommentID={getReplyCommentsByCommentID}
          />
        ))}
      </div>
    </div>
  );
}

const CommentItem = ({ comment, getUserNameById, getReplyCommentsByCommentID }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [newReply, setNewReply] = useState("");
  const [replyComments, setReplyComments] = useState([]);

  useEffect(() => {
    const replies = getReplyCommentsByCommentID(comment.commentID);
    setReplyComments(replies);
  }, [comment.commentID]);

  const onReplyComment = () => {
    const authData = sessionStorage.getItem("auth");
    console.log("Auth data:", authData);
    const user = authData ? JSON.parse(authData) : null;
    console.log("User:", user);
    let newReplyData = {};
    console.log("user: ", user);
    if (user) {
      newReplyData = {
        body: newReply,
        commentID: comment.commentID,
        replierID: user.userId,
        commentDetail: newReply,
        dateOfInteract: new Date().toISOString(),
      };

      fetch("http://localhost:7233/api/replycomment/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReplyData),
      })
        .then((response) => response.json())
        .then((data) => {
          setReplyComments((prevReplies) => [data, ...prevReplies]);
          setNewReply("");
          const _updateInteractData = async () => {
            try {
              console.log("Calling /api/interact/update...");
              return await axios.put("http://localhost:7233/api/interact/update");
            } catch (error) {
              console.error("Error updating interact data:", error);
            }
          };
          console.log("Now call _updateInteractData...");
          _updateInteractData();
        })
        .catch((error) => {
          console.error("Error posting reply comment:", error);
        });
      const _Func = async () => {
        return await axios.put("http://localhost:7233/api/artworks/update-comments-count");
      };
      _Func();
    }
  };

  return (
    <div className="comment-card glass-card">
      <div className="comment-content">
        <span>
          <Typography sx={{ color: "#FFFFFF", fontWeight: "Bold" }}>{getUserNameById(comment.userID)}:</Typography>{" "}
          <Typography>{comment.commentDetail}</Typography>
        </span>
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
            <span>
              {getUserNameById(reply.replierID)}: {reply.commentDetail}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

function CommentInput({ artworkID }) {
  const [commentBody, setCommentBody] = useState("");

  const formik = useFormik({
    initialValues: {
      commentDetail: "",
    },
    validationSchema: Yup.object({
      commentDetail: Yup.string().required("Comment cannot be empty"),
    }),
    onSubmit: (values) => {
      const authData = sessionStorage.getItem("auth");

      const user = authData ? JSON.parse(authData) : null;

      if (user) {
        const commentData = {
          commentDetail: values.commentDetail,
          artworkID: artworkID,
          userID: user.userId,
          createdDate: new Date().toISOString(),
        };

        formik.values.commentDetail = "";

        fetch("http://localhost:7233/api/comments/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(commentData),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Comment saved successfully:", data);
            const _updateInteractData = async () => {
              try {
                const response = await axios.put("http://localhost:7233/api/interact/update");
                console.log("Interact data updated successfully:", response.data);
              } catch (error) {
                console.error("Error updating interact data:", error);
              }
            };

            _updateInteractData();
            formik.resetForm();
          })
          .catch((error) => {
            console.error("Error posting comment:", error);
          });

        const _Func = async () => {
          return await axios.put("http://localhost:7233/api/artworks/update-comments-count");
        };
        _Func();
      } else {
        console.log("User not logged in");
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
