import React, { useCallback, useContext, useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import CustomizedDrawer from "../StyledMUI/CustomizedDrawer.tsx";
import AppLogo from "../StyledMUI/AppLogo.jsx";
import ExpandingSearchBar from "../StyledMUI/CustomizedSearchBar.jsx";
import CustomizedDropdown from "../StyledMUI/CustomizedDropdown.tsx";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import LoginForm from "../Forms/LoginForm.jsx";
import { useHandleClick } from "../../CustomHooks/HandleClick.jsx";
import { Creator } from "../../Interfaces/UserInterface";
import "../../css/Package.css";
import PremiumTypography from "../StyledMUI/PremiumTypography.tsx";
import { CurrentPackage } from "../../Interfaces/Package.ts";
import ChipDepositeCoin from "../StyledMUI/ChipDepositeCoin.tsx";
import { GetCurrentPackageByAccountID } from "../../API/PackageAPI/GET.tsx";

export default function Menu({ onCurrentPackageChange }) {
  // Thêm prop callback
  const { theme } = useContext(ThemeContext);
  const savedAuth = sessionStorage.getItem("auth");
  const user: Creator = savedAuth ? JSON.parse(savedAuth) : null;
  const [isOpen, handleClick] = useHandleClick();
  const [pack, setPack] = useState<CurrentPackage | null>(null);

  // Bọc handlePackageChange trong useCallback để tránh thay đổi không cần thiết
  const handlePackageChange = useCallback(
    (currentPackage: CurrentPackage | null) => {
      setPack(currentPackage);
      if (onCurrentPackageChange) onCurrentPackageChange(currentPackage); // Gửi lên cha
    },
    [onCurrentPackageChange]
  );

  useEffect(() => {
    const getPackage = async () => {
      if (user?.accountId) {
        const servicePackage = await GetCurrentPackageByAccountID(Number(user.accountId));
        console.log("Fetched Pack in Menu:", servicePackage);
        handlePackageChange(servicePackage ?? null);
      }
    };
    getPackage();
  }, [user?.accountId, handlePackageChange]);

  return (
    <div>
      <Popper open={isOpen} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            <Box>
              <LoginForm handleClick={handleClick} backdrop="backdrop" />
            </Box>
          </Fade>
        )}
      </Popper>
      <Box sx={{ flexGrow: 1, boxShadow: "50px", width: "100vw", position: "fixed", zIndex: 1000 }}>
        <AppBar
          sx={{ transition: theme.transition, color: theme.color, backgroundColor: theme.backgroundColor }}
          position="static">
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CustomizedDrawer />
              <AppLogo />
              <ExpandingSearchBar />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Link to={`package`}>
                <Button>
                  <PremiumTypography pack={pack} />
                </Button>
              </Link>
              {user === null ? (
                <Link to={"/"}>
                  <h3 style={{ fontWeight: "normal" }}>Login</h3>
                </Link>
              ) : (
                ""
              )}
              <Button onClick={user === null ? handleClick : undefined} color="inherit">
                <Link to={user !== null ? "artworkform" : ""}>
                  <h3 style={{ fontWeight: "normal" }}>Publish Your Works</h3>
                </Link>
              </Button>
              <Link to={`depositecoin`}>
                <Button>
                  <ChipDepositeCoin user={user} />
                </Button>
              </Link>
              <CustomizedDropdown handleClickAsGuest={handleClick} user={user} pack={pack} />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      <Box sx={{ paddingTop: "64px" }}>{/* Main content goes here */}</Box>
    </div>
  );
}
