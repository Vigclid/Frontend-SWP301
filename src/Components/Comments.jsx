import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import CustomizedButton from "./StyledMUI/CustomizedButton.tsx";
import CustomizedTextField from "./StyledMUI/CustomizedTextField.tsx";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "../css/Comment.css"; // Import CSS file
import { Alert, Typography } from "@mui/material";

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [creators, setCreators] = useState([]);
  const [artworkID, setArtworkID] = useState(null);
  const [replyComments, setReplyComments] = useState([]);
  const [artworkState, setArtworkState] = useState(false);



  useEffect(() => {
    
    const pathParts = window.location.pathname.split("/");
    const id = pathParts[pathParts.length - 1];
    setArtworkID(id);
    Promise.all([
      axios.get(`${process.env.REACT_APP_API_URL}/comments/`),
      axios.get(`${process.env.REACT_APP_API_URL}/replycomment`),
      axios.get(`${process.env.REACT_APP_API_URL}/Creator`)
    ])
      .then(([commentsResponse, replyCommentsResponse, creatorsResponse]) => {
        setComments(commentsResponse.data);
        setReplyComments(replyCommentsResponse.data);
        setCreators(creatorsResponse.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setComments([]);
        setReplyComments([]);
        setCreators([]);
      });
  }, [artworkState]);

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
        <CommentInput onComment={onComment} artworkID={artworkID}  
        setArtworkState = {setArtworkState}
            artworkState = {artworkState}
            />
      </div>
      <div className="comments-list">
        {filteredComments.map((comment, index) => (
          <CommentItem
            key={index}
            comment={comment}
            getUserNameById={getUserNameById}
            getReplyCommentsByCommentID={getReplyCommentsByCommentID}
            setArtworkState = {setArtworkState}
            artworkState = {artworkState}
          />
        ))}
      </div>
    </div>
  );
}

const CommentItem = ({ comment, getUserNameById, getReplyCommentsByCommentID , setArtworkState , artworkState}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [newReply, setNewReply] = useState("");
  const [replyComments, setReplyComments] = useState([]);

  useEffect(() => {
    const replies = getReplyCommentsByCommentID(comment.commentID);
    setReplyComments(replies);
  }, [comment.commentID]);

  const onReplyComment = () => {
    const authData = sessionStorage.getItem("auth");
    const user = authData ? JSON.parse(authData) : null;
    let newReplyData = {};
    
    if (user === null) {
      alert("You need to be logged in to comment.");
      return;
    }
    if (user) {
      newReplyData = {
        body: newReply,
        commentID: comment.commentID,
        replierID: user.userId,
        commentDetail: newReply,
        dateOfInteract: new Date().toISOString(),
      };

      fetch(`${process.env.REACT_APP_API_URL}/replycomment/add`, {
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
              return await axios.put(`${process.env.REACT_APP_API_URL}/interact/update`);
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
        return await axios.put(`${process.env.REACT_APP_API_URL}/artworks/update-comments-count`);
      };
      _Func();
    }

    setArtworkState(!artworkState);
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

function CommentInput({ artworkID , setArtworkState , artworkState }) {
  

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
      if (user === null) {
        alert("You need to be logged in to comment.");
        return;
      }

      if (user) {
        const commentData = {
          commentDetail: values.commentDetail,
          artworkID: artworkID,
          userID: user.userId,
          createdDate: new Date().toISOString(),
        };

        formik.values.commentDetail = "";

        fetch(`${process.env.REACT_APP_API_URL}/comments/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(commentData),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Comment saved successfully:", data);
            const _updateInteractData = async () => {
              try {
                const response = await axios.put(`${process.env.REACT_APP_API_URL}/interact/update`);
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
          return await axios.put(`${process.env.REACT_APP_API_URL}/artworks/update-comments-count`);
        };
        _Func();
      } else {
        Alert("Please login to continue...")
      }

      setArtworkState(!artworkState);
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
