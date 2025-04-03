import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
} from "@mui/material";
import { Creator } from '../../Interfaces/UserInterface.ts';

interface PackageFormPopupProps {
  open: boolean;
  handleClose: () => void;
}

export default function PackageFormPopup({ open, handleClose }: PackageFormPopupProps) {
  const [formText, setFormText] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const savedAuth = sessionStorage.getItem('auth');
  const savedUser: Creator = savedAuth ? JSON.parse(savedAuth) : null;
  console.log('Saved user:', savedUser);

  const handleSubmit = async () => {
    if (!isChecked || !formText.trim()) {
      alert("Please fill out the form and confirm the checkbox.");
      return;
    }

    if (!savedUser.userId) {
      alert("User ID is not found in session. Please log in.");
      return;
    }

    const payload = {
      descriptions: formText,
      status: null, // Mặc định là NULL
      dateCreation: new Date().toISOString(),
      userId: savedUser.userId,
    };

    console.log("Sending data to API:", payload);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/artist-form/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.text();
      if (response.ok) {
        console.log("Success:", result);
        alert("Form submitted successfully!");
        handleClose();
      } else {
        console.error("Failed:", result);
        alert("Failed to submit form: " + result);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>

      
      <DialogContent sx={{ backgroundColor: "#2e2e2e", color: "white", padding: "16px" }}>
      <DialogTitle sx={{ backgroundColor: "#2e2e2e", color: "white" }}>
        Privacy
      </DialogTitle>
        {/* Box nhỏ hơn cho phần nội dung Privacy với màu xám sáng hơn */}
        <Box
          sx={{
            backgroundColor: "#4a4a4a", // Màu xám sáng hơn
            padding: "16px",
            borderRadius: "8px",
            marginBottom: "16px",
            maxWidth: "90%", // Giới hạn chiều rộng để box nhỏ hơn
            margin: "0 auto", // Căn giữa box
          }}
        >
          <Typography variant="body2" sx={{ mb: 2, color: "white" }}>
            <strong>ACTIVE PARTICIPATION:</strong> You are an active artist and will maintain regular activity on the platform. You confirm that you are not inactive for an extended period as this may result in account restrictions.
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: "white" }}>
            <strong>ACKNOWLEDGEMENT:</strong> You acknowledge that inactivity for an extended period may result in account restrictions.
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: "white" }}>
            <strong>ARTISTIC SKILLS:</strong> You confirm that you have artistic talent and the ability to create quality artworks. If requested, you may be required to provide proof of your skills (artworks, portfolio, certificates, etc.).
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: "white" }}>
            <strong>PRIVACY & DATA PROTECTION:</strong> Your personal information and account-related data will be protected according to our privacy policy. We may collect activity data to enhance the user experience and detect fraudulent behavior.
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: "white" }}>
            <strong>COMPLIANCE:</strong> You agree to comply with the platform’s community guidelines and policies. Any actions that violate these terms may result in account restrictions or termination.
          </Typography>
        </Box>
        <DialogTitle sx={{ backgroundColor: "#2e2e2e", color: "white" }}>
          Description
        </DialogTitle>
        <TextField
          label="Type here"
          multiline
          rows={4}
          fullWidth
          value={formText}
          onChange={(e) => setFormText(e.target.value)}
          sx={{
            mt: 2,
            backgroundColor: "#424242",
            "& .MuiInputBase-input": { color: "white" },
            "& .MuiInputLabel-root": { color: "gray" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "gray" },
              "&:hover fieldset": { borderColor: "white" },
              "&.Mui-focused fieldset": { borderColor: "white" },
            },
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              sx={{ color: "white", "&.Mui-checked": { color: "white" } }}
            />
          }
          label="I confirm that this form is accurate and truthful."
          sx={{ mt: 2, color: "white" }}
        />
      </DialogContent>
      <DialogActions sx={{ backgroundColor: "#2e2e2e" }}>
        <Button onClick={handleClose} sx={{ color: "white", border: "1px solid white", mr: 1 }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          sx={{
            backgroundColor: "#1976d2",
            color: "white",
            "&:hover": { backgroundColor: "#1565c0" },
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}