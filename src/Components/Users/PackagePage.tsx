import { Box, Card, Divider } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import "../../css/Package.css";
import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import HomePage from "./MainPage/HomePage";
import { CurrentPackage, Package } from "../../Interfaces/Package.ts";
import { GetCurrentPackageByAccountID, GetPackage } from "../../API/PackageAPI/GET.tsx";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Creator } from "../../Interfaces/UserInterface.ts";
import PackagePaymentConfirm from "./PackagePaymentConfirm.tsx";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DiscountIcon from "@mui/icons-material/Discount";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Stack } from "@mui/material";

export default function PackagePage() {
  const { theme, dark } = useContext(ThemeContext);
  const [packageService, SetPackgeService] = useState<Package[]>();
  const [currentPackage, setCurrentPackage] = useState<CurrentPackage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const savedAuth = sessionStorage.getItem("auth");
  // Check if there's any auth data saved and parse it
  const user: Creator = savedAuth ? JSON.parse(savedAuth) : null;
  // Now 'auth' contains your authentication state or null if there's nothing saved
  const [open, setOpen] = useState(false);
  const [selectPackage, setSelectPackage] = useState<Package>();
  useEffect(() => {
    const getPackage = async () => {
      setLoading(true);
      let packageList: Package[] | undefined = await GetPackage();
      console.log("Fetched package list:", packageList); // Debug log for package list
      SetPackgeService(packageList ?? []);

      let servicePackage: CurrentPackage | null | undefined = await GetCurrentPackageByAccountID(
        Number(user.accountId)
      );

      if (!user?.accountId) {
        console.error("⚠️ Error: No AccountID found in user data");
        return;
      }

      console.log("Current package:", servicePackage); // Debug log for current package
      setCurrentPackage(servicePackage ?? null);
      setLoading(false);
    };
    getPackage();
  }, []);
  const handleOpen = (currentPackage) => {
    setSelectPackage(currentPackage);
    setOpen(!open);
  };

  const currentPack = () => {
    return (
      <Typography sx={{ textAlign: "center", fontFamily: "UniSpace" }} variant="h5" color={theme.color3}>
        Your Current Package
      </Typography>
    );
  };

  const Card1Style = (packageService: Package) => {
    return (
      <Card className="cardRank" sx={{ backgroundImage: 'url("/images/RankCard.png")', borderRadius: "20px" }}>
        <Box
          sx={{
            position: "absolute",
            top: "10px",
            left: "150px",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "auto",
          }}>
          <img src="/images/RankElement1.png" alt="premium" />
        </Box>
        <CardContent>
          <Box sx={{ display: "flex", flexDirection: "column", margin: "20px" }}>
            <Typography
              gutterBottom
              variant="h4"
              color="white"
              component="div"
              className="package-title"
              sx={{ fontFamily: "UniSpace" }}>
              {packageService.typeRankName}
            </Typography>

            <Typography variant="body1" color="white" sx={{ marginTop: "-10px" }}>
              {packageService.price === 0 ? "Free" : packageService.price + "$ / month"}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "white", margin: "40px 20px 20px 20px" }}>
            <Stack spacing={1}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CloudUploadIcon sx={{ color: "white" }} />
                <Typography> Upload 50 Art on Month</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <DiscountIcon sx={{ color: "white" }} />
                <Typography> Get 95% off on all Art</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AccountBalanceWalletIcon sx={{ color: "white" }} />
                <Typography> Cash out coin with Withdrawal feature</Typography>
              </Box>
            </Stack>
          </Box>
        </CardContent>

        <Button
          disabled={currentPackage?.typeID === 2}
          sx={{
            backgroundColor: "none",
            color: "white",
            border: "solid 1.5px",
            borderLeft: "none",
            borderRight: "none",
            borderRadius: "10px",
            width: "50%",
            margin: "auto",
            display: "center",
            ":hover": {
              backgroundColor: "none",
              color: "#FFCF50",
              border: "solid 1px #FFCF50",
              borderLeft: "none",
              borderRight: "none",
              width: "50%",
            },
          }}
          className="buyBtn"
          onClick={() => handleOpen(packageService)}
          size="small">
          {currentPackage?.typeID === 2 ? "You're Using This Package" : "Purchase"}
        </Button>
        {currentPackage?.typeID === 2 && currentPack()}
      </Card>
    );
  };

  const Card2Style = (packageService: Package) => {
    return (
      <Card className="cardRank" sx={{ backgroundImage: 'url("/images/RankCard.png")', borderRadius: "20px" }}>
        <Box
          sx={{
            position: "absolute",
            top: "10px",
            left: "150px",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "auto",
          }}>
          <img src="/images/RankElement2.png" alt="premium" />
        </Box>
        <CardContent>
          <Box sx={{ display: "flex", flexDirection: "column", margin: "20px" }}>
            <Typography
              gutterBottom
              variant="h4"
              color="white"
              component="div"
              className="package-title"
              sx={{ fontFamily: "UniSpace" }}>
              {packageService.typeRankName}
            </Typography>

            <Typography variant="body1" color="white" sx={{ marginTop: "-10px" }}>
              {packageService.price === 0 ? "Free" : packageService.price + "$ / month"}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "white", margin: "40px 20px 20px 20px" }}>
            <Stack spacing={1}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CloudUploadIcon sx={{ color: "white" }} />
                <Typography> Upload 50 Art on Month</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <DiscountIcon sx={{ color: "white" }} />
                <Typography> Get 95% off on all Art</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AccountBalanceWalletIcon sx={{ color: "white" }} />
                <Typography> Cash out coin with Withdrawal feature</Typography>
              </Box>
            </Stack>
          </Box>
        </CardContent>

        <Button
          disabled={currentPackage?.typeID === 3}
          sx={{
            backgroundColor: "none",
            color: "white",
            border: "solid 1.5px",
            borderLeft: "none",
            borderRight: "none",
            borderRadius: "10px",
            width: "50%",
            margin: "auto",
            display: "center",
            ":hover": {
              backgroundColor: "none",
              color: "#FFCF50",
              border: "solid 1px #FFCF50",
              borderLeft: "none",
              borderRight: "none",
              width: "50%",
            },
          }}
          className="buyBtn"
          onClick={() => handleOpen(packageService)}
          size="small">
          {currentPackage?.typeID === 3 ? "You're Using This Package" : "Purchase"}
        </Button>
        {currentPackage?.typeID === 3 && currentPack()}
      </Card>
    );
  };

  const Card3Style = (packageService: Package) => {
    return (
      <Card className="cardRank" sx={{ backgroundImage: 'url("/images/RankCard.png")', borderRadius: "20px" }}>
        <Box
          sx={{
            position: "absolute",
            top: "10px",
            left: "150px",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "auto",
          }}>
          <img src="/images/RankElement3.png" alt="premium" />
        </Box>
        <CardContent>
          <Box sx={{ display: "flex", flexDirection: "column", margin: "20px" }}>
            <Typography
              gutterBottom
              variant="h4"
              color="white"
              component="div"
              className="package-title"
              sx={{ fontFamily: "UniSpace" }}>
              {packageService.typeRankName}
            </Typography>

            <Typography variant="body1" color="white" sx={{ marginTop: "-10px" }}>
              {packageService.price === 0 ? "Free" : packageService.price + "$ / month"}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "white", margin: "40px 20px 20px 20px" }}>
            <Stack spacing={1}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CloudUploadIcon sx={{ color: "white" }} />
                <Typography> Upload 50 Art on Month</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <DiscountIcon sx={{ color: "white" }} />
                <Typography> Get 95% off on all Art</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AccountBalanceWalletIcon sx={{ color: "white" }} />
                <Typography> Cash out coin with Withdrawal feature</Typography>
              </Box>
            </Stack>
          </Box>
        </CardContent>

        <Button
          disabled={currentPackage?.typeID === 4}
          sx={{
            backgroundColor: "none",
            color: "white",
            border: "solid 1.5px",
            borderLeft: "none",
            borderRight: "none",
            borderRadius: "10px",
            width: "50%",
            margin: "auto",
            display: "center",
            ":hover": {
              backgroundColor: "none",
              color: "#FFCF50",
              border: "solid 1px #FFCF50",
              borderLeft: "none",
              borderRight: "none",
              width: "50%",
            },
          }}
          className="buyBtn"
          onClick={() => handleOpen(packageService)}
          size="small">
          {currentPackage?.typeID === 4 ? "You're Using This Package" : "Purchase"}
        </Button>
        {currentPackage?.typeID === 4 && currentPack()}
      </Card>
    );
  };

  const ArtistCard = ({ packageService, handleOpen }) => {
    return (
      <Card
        className="artist-card"
        sx={{
          backgroundImage: 'url("/images/ArtistCard.png")',
          borderRadius: "30px",
          display: "flex",
          flexDirection: "row",
          overflow: "hidden",
        }}>
        {/* Left Column: Image */}
        <Box
          className="artist-card-img"
          sx={{
            width: { xs: "35%", md: "30%" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 1,
          }}>
          <img
            src="/images/RankElement4.png" // update with your desired image path
            alt="package image"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </Box>

        {/* Right Column: Content */}
        <Box
          className="artist-card-content"
          sx={{
            width: { xs: "65%", md: "70%" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            pl: 2,
          }}>
          {/* Rank Name */}
          <Typography variant="h4" color="white" sx={{ fontFamily: "UniSpace", mb: 1 }}>
            {packageService.typeRankName}
          </Typography>

          {/* Additional content below rank name */}
          <Typography variant="body1" color="white" sx={{ mb: 2 }}>
            Here is some additional detail or offer description related to the package.
          </Typography>

          {/* Button below additional content */}
          <Button
            className="artist-card-button"
            variant="outlined"
            sx={{
              color: "white",
              border: "solid 1.5px white",
              borderRadius: "5px",
              alignSelf: "flex-start",
              transition: "all 0.3s ease",
              ":hover": {
                border: "solid 1px #FFCF50",
                color: "#FFCF50",
              },
            }}
            onClick={() => handleOpen(packageService)}>
            Send Us
          </Button>
        </Box>
      </Card>
    );
  };

  return (
    <div className="packagePage"> 
      <Box
        sx={{
          color: theme.color,
          backgroundColor: `rgba(${theme.rgbBackgroundColor},0.97)`,
          backgroundImage: dark ? 'url("/images/darkPackage.jpg")' : 'url("/images/lightPackage.jpg")',
          transition: theme.transition,
          width: "95%",
          margin: "auto",
          borderRadius: "5px",
          marginBottom: "15px",
        }}>
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 100 }} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        {error && (
          <Typography color="error" sx={{ padding: "1rem" }}>
            {error}
          </Typography>
        )}
        <Box sx={{ padding: "2% 2% 0% 2%" }}>
          <Typography variant="h4" color={theme.color}>
            Account Packages
          </Typography>
          <Divider sx={{ borderColor: theme.color }} />
        </Box>
        <Box className="packageContainer">
          {!packageService ? (
            <Typography>Loading packages...</Typography>
          ) : packageService.length === 0 ? (
            <Typography>No packages found</Typography>
          ) : (
            packageService.map((service, index) => {
              return index === 1
                ? Card1Style(service)
                : index === 2
                ? Card2Style(service)
                : index === 3
                ? Card3Style(service)
                : "";
            })
          )}
        </Box>

        <Box sx={{ padding: "0% 2% 2% 2%" }}>
          {packageService?.map((service, index) =>
            index === 4 ? <ArtistCard packageService={service} handleOpen={handleOpen} key={index} /> : null
          )}
        </Box>
      </Box>
      <PackagePaymentConfirm open={open} handleClose={handleOpen} item={selectPackage} />
    </div>
  );
}

