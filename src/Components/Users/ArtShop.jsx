import {
  Backdrop,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  IconButton,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { getArtWithStatus } from "../../API/ArtShop/ArtShopServices.tsx";
import { Discount, Download, Headset, More, ShareLocation, Shop } from "@mui/icons-material";
import { pink } from "@mui/material/colors";
import "../../css/ArtShop.css";
import html2canvas from "html2canvas";
import { Link } from "react-router-dom";
import ArtShopDialog from "./ArtShopDialog.jsx";
import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

function ArtShop() {
  const auth = JSON.parse(sessionStorage.getItem("auth"));
  const [dataState, setDataSate] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDowload, setOpenDowload] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setOpenDowload(false);
    setDataSate((pre) => ({
      ...pre,
      idDowLoad: null,
    }));
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const search = async () => {
    try {
      handleOpen();
      const userId = auth?.userId; // Lấy userId từ session
      const data = await getArtWithStatus(userId, dataState?.currentPage); // Truyền userId vào API
      console.log("data: ", data);
      setDataSate((pre) => ({
        ...pre,
        listItem: data?.data, // Điều chỉnh nếu cần dựa trên cấu trúc response từ backend
        totalPages: data?.headers["x-total-pages"]
          ? parseInt(data.headers["x-total-pages"])
          : Math.ceil(data?.data?.length / 8), // Tính tổng số trang
      }));
    } catch (error) {
      console.log("error: ", error);
    } finally {
      handleClose();
    }
  };

  function formatMoney(amount) {
    return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
 }


  const downloadSectionAsImage = async (elementId) => {
    const element = document.getElementById(elementId);

    if (element) {
      const canvas = await html2canvas(element);
      const imageUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = "image.png";
      link.click();
      handleClose();
    }
  };

  const handleYesClick = async () => {
    await downloadSectionAsImage(dataState?.idDowLoad);
  };

  const handleDownload = async (id) => {
    setDataSate((pre) => ({
      ...pre,
      idDowLoad: id,
    }));
    setOpenDowload(true);
  };

  useEffect(() => {
    search();
  }, [dataState?.currentPage, auth?.userId]); // Re-fetch khi currentPage hoặc userId thay đổi

  const { theme } = useContext(ThemeContext);

  return (
    <div style={{ paddingTop: "2%", paddingBottom: "5%" }}>
      <Box
        className="box"
        sx={{
          color: "#61dafb",
          backgroundColor: `rgba(${theme.rgbBackgroundColor},0.50)`,
          backgroundImage: `url("/images/shopBackground.jpg")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          transition: theme.transition,
          width: "86%",
          margin: "auto",
          borderRadius: "5px",
          paddingLeft: 5,
          paddingRight: 5,
          paddingBottom: "1%",
        }}>
        <Backdrop sx={{ color: "#fff", zIndex: 99 }} open={open}>
          <CircularProgress color="inherit" />
        </Backdrop>
        {openDowload && <ArtShopDialog open={openDowload} handleClose={handleClose} handleYesClick={handleYesClick} />}
        <h1>Purchasable Artworks:</h1>
        <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap", mt: 4, justifyContent: "center" }}>
          {dataState?.listItem?.map((art, index) => {
            return (
              <div class="card1" key={index}>
                <div class="card1-info">
                  <Card
                    sx={{
                      width: 280,
                      height: "auto",
                      background: theme.backgroundColor3,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      borderRadius: 1,
                    }}>
                    <Link to={`../artwordrecomment/artwork/${art?.artworkID}`}>
                      <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                          {art?.artworkName}
                        </Typography>
                        <div>
                          <img
                            style={{ pointerEvents: "none", objectFit: "cover" }}
                            id={`img-${index}`}
                            className="w-full h-500"
                            src={art?.imageFile}
                            alt={art?.artworkName}
                          />
                        </div>

                        <Typography variant="body2" color="text.secondary">
                          <IconButton aria-label="add to favorites">
                            <FavoriteBorderIcon sx={{ color: pink[500] }} />
                          </IconButton>
                          {art?.likes}
                          <IconButton aria-label="share">
                            <Discount sx={{ color: pink[500] }} />
                          </IconButton>
                          {formatMoney(art?.price)}
                        </Typography>
                      </CardContent>
                    </Link>
                    <CardActions>
                      <Link to={`../artwordrecomment/artwork/${art?.artworkID}`}>
                        <Button
                          sx={{ minWidth: "30%", margin: "0px 50px 5px 15px" }}
                          variant="contained"
                          size="small"
                          title="Detail">
                          <More />
                        </Button>
                      </Link>
                      {/* {
                                                art?.purchasable === true 
                                                && // Kiểm tra nếu artwork có purchasable = 1
                                                <Button sx={{ minWidth: '30%', marginBottom: '5px' }}
                                                    variant="contained" size="small" title='Download' onClick={() => handleDownload(`img-${index}`)}>
                                                    <Download />
                                                </Button>
                                            } */}
                    </CardActions>
                  </Card>
                </div>
              </div>
            );
          })}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", margin: "15px 0px 10px 0px", padding: "2%" }}>
          <Stack spacing={2}>
            <Pagination
              sx={{
                background: theme.color,
                borderRadius: "20px",
                "& .MuiPaginationItem-root": {
                  color: theme.backgroundColor,
                  borderColor: "white",
                  "&:hover": {
                    backgroundColor: theme.backgroundColor,
                    color: theme.color,
                  },
                  "&.Mui-selected": {
                    backgroundColor: theme.backgroundColor,
                    color: theme.color,
                    "&:hover": {
                      backgroundColor: "darkgray",
                    },
                  },
                },
              }}
              count={dataState?.totalPages}
              onChange={(e, page) => {
                setDataSate((pre) => ({
                  ...pre,
                  currentPage: page,
                }));
              }}
            />
          </Stack>
        </Box>
      </Box>
    </div>
  );
}

export default ArtShop;
