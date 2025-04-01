import React, { useContext, useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Checkbox, FormControlLabel } from "@mui/material";
import { WithdrawInterfaces } from "../../Interfaces/WithdrawInterfaces";
import { SendWithdrawForm } from "../../API/WithdrawAPI/POST.tsx";
import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import { Creator } from "../../Interfaces/UserInterface";
import axios from "axios";

interface WithdrawFormProps {
  onClose: () => void;
}

export default function WithdrawForm({ onClose }: WithdrawFormProps) {
  const savedAuth = sessionStorage.getItem("auth");
  const user: Creator | null = savedAuth ? JSON.parse(savedAuth) : null;
  const [userBalance, setUserBalance] = useState<number>(0);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [bankName, setBankName] = useState<string>("");
  const [bankNumber, setBankNumber] = useState<string>("");
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { theme } = useContext(ThemeContext);

  console.log("User in WithdrawForm:", user);
  useEffect(() => {
    const fetchBalance = async () => {
      if (!user?.userId) return;
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/Creator/` + user.accountId);
        setUserBalance(response.data.coins || 0);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };
    fetchBalance();
  }, [user?.userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.userId) {
      setError("User not found");
      return;
    }
    if (withdrawAmount > userBalance) {
      setError("Insufficient balance");
      return;
    }
    if (!confirmed) {
      setError("Please confirm your withdrawal");
      return;
    }

    const withdrawData: Partial<WithdrawInterfaces> = {
      coinWithdraw: withdrawAmount,
      userID: user.userId.toString(),
      bankNumber: bankNumber,
      bankName: bankName,
    };

    try {
      await SendWithdrawForm(withdrawData);
      onClose();
    } catch (error) {
      console.error("Error submitting withdrawal:", error);
      setError("Failed to submit withdrawal request");
    }
  };

  const calculateAmountAfterFee = (amount: number): number => {
    return amount * 0.9; // 10% fee
  };

  return (
    <Box
      sx={{
        p: 3,
        maxWidth: 400,
        margin: "auto",
        backgroundColor: theme.backgroundColor,
        color: theme.color,
        border: `1px solid ${theme.color6}`,
        borderRadius: "8px",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
      }}>
      <Typography variant="h5" gutterBottom sx={{ color: theme.color2 }}>
        Withdraw Coins Form
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Your Balance: {userBalance}
        </Typography>

        <TextField
          fullWidth
          type="text"
          label="Amount Coins"
          value={withdrawAmount === 0 ? "0" : withdrawAmount}
          onChange={(e) => {
            const value = e.target.value.replace(/^0+/, "");
            const numValue = value === "" ? 0 : Number(value);
            if (!isNaN(numValue) && numValue >= 0) {
              setWithdrawAmount(numValue);
            }
          }}
          error={!!error && error === "Insufficient balance"}
          helperText={error === "Insufficient balance" ? error : ""}
          InputProps={{
            sx: {
              color: theme.color,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.color6,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.color2,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.color2,
              },
            },
          }}
          sx={{
            mb: 2,
            "& .MuiInputLabel-root": {
              color: theme.color3,
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: theme.color2,
            },
          }}
        />

        <Typography variant="subtitle1" gutterBottom>
          You will get: {calculateAmountAfterFee(withdrawAmount)} (-10%)
        </Typography>

        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
          Your transaction fee helps keep the website running. Thank you!
        </Typography>

        <TextField
          fullWidth
          label="Name of your bank"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          InputProps={{
            sx: {
              color: theme.color,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.color6,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.color2,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.color2,
              },
            },
          }}
          sx={{
            mb: 2,
            "& .MuiInputLabel-root": {
              color: theme.color3,
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: theme.color2,
            },
          }}
        />

        <TextField
          fullWidth
          label="Bank Account Number"
          value={bankNumber}
          onChange={(e) => setBankNumber(e.target.value)}
          InputProps={{
            sx: {
              color: theme.color,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.color6,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.color2,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.color2,
              },
            },
          }}
          sx={{
            mb: 2,
            "& .MuiInputLabel-root": {
              color: theme.color3,
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: theme.color2,
            },
          }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              sx={{
                color: theme.color3,
                "&.Mui-checked": {
                  color: theme.color2,
                },
              }}
            />
          }
          label="I confirm that I want to withdraw"
          sx={{
            color: theme.color,
          }}
        />

        {error && error !== "Insufficient balance" && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              color: theme.color2,
              borderColor: theme.color2,
              "&:hover": {
                borderColor: theme.color2,
                backgroundColor: `${theme.color2}20`,
              },
            }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            sx={{
              backgroundColor: theme.color2,
              color: theme.backgroundColor,
              "&:hover": {
                backgroundColor: theme.color5,
              },
            }}>
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
