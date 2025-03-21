import React, { useContext, useState, useCallback } from "react";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import { styled } from "@mui/material/styles";
import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthenContext.tsx";
import { Creator } from "../../Interfaces/UserInterface";
import { LightDarkSwitch } from "./CustomizedLightDarkSwitch.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGem } from "@fortawesome/free-solid-svg-icons";
import { CurrentPackage } from "../../Interfaces/Package.ts";
import WithdrawForm from "../Users/WithdrawForm.tsx";

interface CustomizedDropdownProps {
  user: Creator;
  handleClickAsGuest: any;
  pack: CurrentPackage | null;
}

export default function CustomizedDropdown({ user, handleClickAsGuest, pack }: CustomizedDropdownProps) {
  const { theme, toggleTheme, dark } = useContext(ThemeContext);
  const { logout } = useAuth();

  const CustomizedMenu = styled(Menu)(() => ({
    "& .MuiPaper-root": {
      backgroundColor: theme.backgroundColor,
      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
      color: theme.color,
      border: theme.borderColor,
    },
  }));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const handleClickDropdown = (event: React.MouseEvent<HTMLElement>) => {
    if (!user) {
      handleClickAsGuest();
    } else {
      setAnchorEl(event.currentTarget);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const DropdownContent = () => (
    <>
      <Divider sx={{ "&::before, &::after": { backgroundColor: theme.color } }} variant="middle">
        <Typography variant="caption">Account</Typography>
      </Divider>
      <MenuItem>
        <Link to={`profile/${user.accountId}`}>Profile</Link>
      </MenuItem>
      <MenuItem onClick={() => setWithdrawOpen(true)}>Withdraw</MenuItem>
      <Divider sx={{ "&::before, &::after": { backgroundColor: theme.color } }} variant="middle">
        <Typography variant="caption">Theme</Typography>
      </Divider>
      <MenuItem>
        <LightDarkSwitch onClick={toggleTheme} checked={dark} />
      </MenuItem>
      <Divider sx={{ backgroundColor: theme.color }} variant="middle" />
      <MenuItem onClick={logout}>Logout</MenuItem>

      <Dialog
        open={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: theme.backgroundColor,
            color: theme.color,
            border: theme.borderColor,
          },
        }}>
        <WithdrawForm onClose={() => setWithdrawOpen(false)} />
      </Dialog>
    </>
  );

  const vipEffect = {
    zIndex: 1000,
    textAlign: "center" as const,
    position: "absolute" as const,
    bottom: 0,
    right: 0,
    bgcolor: "gold",
    padding: "2px 6px",
    borderRadius: "4px",
    transform: "translate(-45%, 25%)",
    fontSize: "12px",
    fontWeight: "bold",
    color: "black",
    display: "flex",
    alignItems: "center",
    gap: "2px",
    animation: "blink-animation 1.5s infinite",
    "@keyframes blink-animation": {
      "0%, 100%": {
        backgroundColor: "gold",
        color: "black",
        boxShadow: "0 0 8px rgba(255, 215, 0, 0.6)",
      },
      "50%": {
        backgroundColor: "black",
        color: "gold",
        boxShadow: "0 0 8px rgba(0, 0, 0, 0.6)",
      },
    },
  };

  return (
    <Box sx={{ position: "relative", display: "inline-block" }}>
      <IconButton
        onClick={handleClickDropdown}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}>
        <Avatar src={user?.profilePicture} sx={{ width: 40, height: 40 }}>
          {user?.userName || ""}
        </Avatar>
        {pack?.typeID === 2 && (
          <Typography sx={vipEffect}>
            VIP
            <FontAwesomeIcon icon={faGem} />
          </Typography>
        )}
      </IconButton>
      {user && (
        <CustomizedMenu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <DropdownContent />
          </Box>
        </CustomizedMenu>
      )}
    </Box>
  );
}
