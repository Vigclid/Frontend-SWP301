import React, { useState, useContext } from "react";
import { Box, Button, Checkbox, Typography } from "@mui/material";
import axios from "axios";
import { Report } from "../../../Interfaces/ReportInterfaces";
import CustomizedTextField from "../../StyledMUI/CustomizedTextField.tsx";
import { ThemeContext } from "../../Themes/ThemeProvider.tsx";

const reasons = [
  "Inappropriate content (violence, nudity, hate speech, discrimination)",
  "Copyright infringement (stolen or copied artwork)",
  "Spam or scam",
  "Offensive content (profanity, harassment)",
  "False or misleading information",
  "Other",
];

type ReportFormProps = {
  reporterId: number;
  reportedId: number;
  artworkId?: number;
  onClose: () => void;
};

const ReportForm: React.FC<ReportFormProps> = ({ reporterId, reportedId, artworkId, onClose }) => {
  const { theme, dark } = useContext(ThemeContext);
  const [selectedType, setSelectedType] = useState<string | null>(artworkId ? "Artwork" : null);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [otherDescription, setOtherDescription] = useState("");
  const [confirm, setConfirm] = useState(false);

  const handleReasonClick = (reason: string) => {
    setSelectedReasons((prev) => (prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]));
  };

  const handleSubmit = async () => {
    console.log("🔥 Debugging Report Form Submission:");
    console.log("🆔 Reporter ID:", reporterId);
    console.log("🆔 Reported ID:", reportedId);
    console.log("🎨 Artwork ID:", artworkId);
    console.log("📌 Selected Type:", selectedType);
    console.log("⚠️ Selected Reasons:", selectedReasons);
    console.log("📝 Other Description:", otherDescription);
    console.log("✅ Confirmed:", confirm);

    if (!selectedType || selectedReasons.length === 0 || !confirm) {
      alert("Please select content type, at least one reason, and confirm.");
      return;
    }

    const description = selectedReasons.includes("Other") ? otherDescription : selectedReasons.join(", ");
    const reportData: Report = {
      reporterId,
      reportedId,
      artworkId: selectedType === "Artwork" ? artworkId : undefined,
      description,
      status: 0,
    };

    console.log("📤 Sending Report Data:", reportData);

    try {
      const response = await axios.post("http://localhost:7233/api/Report/Form", reportData);
      console.log("✅ Report submitted successfully:", response.data);
      alert("Report submitted successfully.");
      onClose();
    } catch (error) {
      console.error("❌ Error submitting report:", error);
      alert("Failed to submit report.");
    }
  };

  return (
    <Box sx={{ p: 3, background: theme.backgroundColor, color: theme.color }}>
      <Typography variant="h5" color={theme.color}>
        Report Violation
      </Typography>

      <Typography mt={2} color={theme.color}>
        1. Select the type of content to report
      </Typography>
      <Box display="flex" gap={2}>
        {["Artwork", "User"].map((type) => (
          <Button
            key={type}
            variant="outlined"
            onClick={() => setSelectedType(type)}
            sx={{
              color: selectedType === type ? (dark ? theme.color : theme.color4) : theme.color2,
              borderColor: selectedType === type ? theme.color : theme.color2,
              backgroundColor: selectedType === type && !dark ? theme.backgroundColor2 : "transparent",
              "&:hover": {
                backgroundColor: selectedType === type && !dark ? theme.backgroundColor2 : "transparent",
              },
            }}>
            {type}
          </Button>
        ))}
      </Box>

      <Typography mt={2} color={theme.color}>
        2. Reason for reporting
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={1}>
        {reasons.map((reason) => (
          <Button
            key={reason}
            variant="outlined"
            onClick={() => handleReasonClick(reason)}
            sx={{
              color: selectedReasons.includes(reason) ? (dark ? theme.color : theme.color4) : theme.color2,
              borderColor: selectedReasons.includes(reason) ? theme.color : theme.color2,
              backgroundColor: selectedReasons.includes(reason) && !dark ? theme.backgroundColor2 : "transparent",
              "&:hover": {
                backgroundColor: selectedReasons.includes(reason) && !dark ? theme.backgroundColor2 : "transparent",
              },
            }}>
            {reason}
          </Button>
        ))}
      </Box>

      {selectedReasons.includes("Other") && (
        <CustomizedTextField
          fullWidth
          variant="outlined"
          label="Describe the issue"
          sx={{
            mt: 2,
            "& .MuiInputBase-root": {
              color: theme.color,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.color2,
            },
            "& .MuiInputLabel-root": {
              color: theme.color2,
            },
          }}
          value={otherDescription}
          onChange={(e) => setOtherDescription(e.target.value)}
        />
      )}

      <Box display="flex" alignItems="center" mt={2}>
        <Checkbox checked={confirm} onChange={(e) => setConfirm(e.target.checked)} sx={{ color: theme.color }} />
        <Typography color={theme.color}>I confirm that this report is accurate and truthful.</Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button variant="outlined" onClick={onClose} sx={{ color: theme.color, borderColor: theme.color2 }}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ backgroundColor: theme.color }}>
          Submit Report
        </Button>
      </Box>
    </Box>
  );
};

export default ReportForm;
