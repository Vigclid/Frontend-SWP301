import React, { useContext, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box } from "@mui/material";
import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import { UploadThread } from "../../API/ForumAPI/POST.tsx";
import { Creator } from "../../Interfaces/UserInterface.tsx";
import "../../css/Thread.css";

interface ThreadUploadProps {
  open: boolean;
  onClose: () => void;
  topicID: number;
  refreshThreads: () => void;
}

const ThreadUpload: React.FC<ThreadUploadProps> = ({ open, onClose, topicID, refreshThreads }) => {
  const { theme } = useContext(ThemeContext);
  const [titleThread, setTitleThread] = useState("");
  const [threadDescription, setThreadDescription] = useState("");

  const authData = sessionStorage.getItem("auth");
  const user: Creator = authData ? JSON.parse(authData) : null;

  const handleSubmit = async () => {
    try {
      if (!user) {
        console.error("No user data in session");
        alert("Please log in to create a thread");
        return;
      }

      if (!titleThread.trim() || !threadDescription.trim()) {
        alert("Please fill in all fields");
        return;
      }

      const creatorId = typeof user.userId === "string" ? parseInt(user.userId) : user.userId;

      console.log("Creating thread with data:", {
        creatorId,
        topicID,
        titleThread,
        user,
      });

      await UploadThread({
        titleThread,
        threadDescription,
        topicID,
        userId: creatorId,
      });

      setTitleThread("");
      setThreadDescription("");
      refreshThreads();
      onClose();
    } catch (error) {
      console.error("Error creating thread:", error);
      alert("Failed to create thread. Please try again.");
    }
  };

  const handleClose = () => {
    setTitleThread("");
    setThreadDescription("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className="thread-dialog"
      PaperProps={{
        sx: {
          backgroundColor: theme.backgroundColor,
          background: `linear-gradient(145deg, ${theme.backgroundColor} 0%, ${theme.backgroundColor2} 100%)`,
          border: `1px solid ${theme.color}20`,
        },
      }}>
      <DialogTitle
        className="dialog-title"
        sx={{
          color: theme.color,
          borderBottom: `1px solid ${theme.color}20`,
        }}>
        Create New Thread
      </DialogTitle>
      <DialogContent className="dialog-content">
        <Box className="form-container">
          <div className="field-container">
            <TextField
              label="Title"
              value={titleThread}
              onChange={(e) => setTitleThread(e.target.value)}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: theme.color,
                  backgroundColor: theme.backgroundColor,
                  "& fieldset": { borderColor: `${theme.color}40` },
                  "&:hover fieldset": { borderColor: theme.color },
                  "&.Mui-focused fieldset": { borderColor: theme.color },
                },
                "& .MuiInputLabel-root": {
                  color: theme.color,
                  "&.Mui-focused": { color: theme.color },
                },
              }}
            />
          </div>
          <div className="field-container">
            <TextField
              label="Description"
              value={threadDescription}
              onChange={(e) => setThreadDescription(e.target.value)}
              multiline
              rows={6}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: theme.color,
                  backgroundColor: theme.backgroundColor,
                  "& fieldset": { borderColor: `${theme.color}40` },
                  "&:hover fieldset": { borderColor: theme.color },
                  "&.Mui-focused fieldset": { borderColor: theme.color },
                },
                "& .MuiInputLabel-root": {
                  color: theme.color,
                  "&.Mui-focused": { color: theme.color },
                },
              }}
            />
          </div>
        </Box>
      </DialogContent>
      <DialogActions className="dialog-actions">
        <Button
          onClick={handleClose}
          className="cancel-button"
          sx={{
            color: theme.color,
            "&:hover": {
              backgroundColor: `${theme.color}20`,
            },
          }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!user}
          className="submit-button"
          sx={{
            backgroundColor: theme.color,
            color: theme.backgroundColor,
            "&:hover": {
              backgroundColor: theme.color,
              opacity: 0.9,
            },
          }}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ThreadUpload;
