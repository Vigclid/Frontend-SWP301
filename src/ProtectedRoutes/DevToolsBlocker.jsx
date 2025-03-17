import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiBackdrop-root": {
    backdropFilter: "blur(10px)",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  "& .MuiDialog-paper": {
    borderRadius: "24px",
    padding: "20px",
    minWidth: "360px",
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    overflow: "hidden",
  },
  "& .MuiDialogTitle-root": {
    background: "linear-gradient(135deg, rgba(244, 67, 54, 0.9) 0%, rgba(233, 30, 99, 0.9) 100%)",
    color: "white",
    textAlign: "center",
    padding: "20px",
    fontSize: "1.3rem",
    fontWeight: "600",
    letterSpacing: "0.5px",
    borderRadius: "16px",
    margin: "3px 3px 20px 3px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  "& .MuiDialogContent-root": {
    padding: "24px",
    textAlign: "center",
    fontSize: "1.1rem",
    color: "rgba(0, 0, 0, 0.8)",
    background: "rgba(255, 255, 255, 0.6)",
    borderRadius: "16px",
    marginBottom: "16px",
  },
  "& .MuiDialogActions-root": {
    padding: "16px 0 0 0",
    justifyContent: "center",
  },
  "& .MuiButton-root": {
    borderRadius: "16px",
    padding: "10px 32px",
    fontSize: "1.1rem",
    fontWeight: "600",
    textTransform: "none",
    background: "linear-gradient(135deg, rgba(244, 67, 54, 0.9) 0%, rgba(233, 30, 99, 0.9) 100%)",
    color: "white",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(4px)",
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 5px 15px rgba(244, 67, 54, 0.4)",
      background: "linear-gradient(135deg, rgba(233, 30, 99, 0.9) 0%, rgba(244, 67, 54, 0.9) 100%)",
    },
  },
}));

const CustomAlert = ({ open, message, onClose }) => {
  return (
    <StyledDialog open={open} onClose={onClose}>
      <DialogTitle>Cảnh báo bảo mật</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} autoFocus>
          Đã hiểu
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

const DevToolsBlocker = () => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (message) => {
    setAlertMessage(message);
    setAlertOpen(true);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 123) {
        event.preventDefault();
        showAlert("Bạn không được phép mở DevTools!");
        return false;
      }

      if (event.ctrlKey && event.shiftKey && event.keyCode === 73) {
        event.preventDefault();
        showAlert("Bạn không được phép mở DevTools!");
        return false;
      }
    };

    const handleContextMenu = (event) => {
      event.preventDefault();
      showAlert("Chuột phải đã bị vô hiệu hóa!");
    };

    const detectDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      if (widthThreshold || heightThreshold) {
        document.body.style.display = "none";
        showAlert("Vui lòng đóng DevTools để tiếp tục!");
      } else {
        document.body.style.display = "block";
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("contextmenu", handleContextMenu);
    const interval = setInterval(detectDevTools, 1000);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("contextmenu", handleContextMenu);
      clearInterval(interval);
    };
  }, []);

  return <CustomAlert open={alertOpen} message={alertMessage} onClose={() => setAlertOpen(false)} />;
};

export default DevToolsBlocker;
