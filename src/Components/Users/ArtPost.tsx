import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CommentIcon from "@mui/icons-material/Comment";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Comments from "../Comments.jsx";
import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { ListTag } from "../../share/ListofTag.js";
import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import { GetArtById, GetArtsByAccountId, GetArtsPaymentStatus } from "../../API/ArtworkAPI/GET.tsx";
import { Artwork, ArtworkPaymentStatus, DownloadArtwork } from "../../Interfaces/ArtworkInterfaces.ts";
import { GetCreatorByID, GetCreatorByAccountID } from "../../API/UserAPI/GET.tsx";
import { faMoneyBillWave } from "@fortawesome/free-solid-svg-icons";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faTags } from "@fortawesome/free-solid-svg-icons";
import { Creator } from "../../Interfaces/UserInterface.ts";
import Chip from "@mui/material/Chip";
import { Download } from "@mui/icons-material";
import { Button, Divider } from "@mui/material";
import { Tag } from "../../Interfaces/TagInterface.ts";
import { faSignature } from "@fortawesome/free-solid-svg-icons";
import { GetTagByArtId } from "../../API/TagAPI/GET.tsx";
import { Watermark } from "../StyledMUI/AppLogo.jsx";
import { Link } from "react-router-dom";
import { DeleteArtById } from "../../API/ArtworkAPI/DELETE.tsx";
import ArtShopConfirm from "./ArtShopConfirm.jsx";
import html2canvas from "html2canvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ArtShopDialog from "./ArtShopDialog.jsx";
import axios from "axios";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import LikeIcon from "../LikeIcon.jsx";
import "../../css/ArtPost.css";

import Dialog from "@mui/material/Dialog";
import ReportForm from "./UserForms/ReportForm.tsx";
import FavouritesIcon from "../FavouritesIcon.jsx";

// Attempt to retrieve the auth state from sessionStorage
const savedAuth = sessionStorage.getItem("auth");
// Check if there's any auth data saved and parse it
const userInSession: Creator = savedAuth ? JSON.parse(savedAuth) : "";
// Now 'auth' contains your authentication state or null if there's nothing saved

export default function PostWork() {
  const colors = ["#82c87e", "#c07ec8", "#c89c7e", "#7E8DC8", "#C07EC8", "#C87E8A"];
  const { theme } = useContext(ThemeContext);
  const { id } = useParams();
  const [artwork, setArtwork] = useState<DownloadArtwork>();
  const [status, setStatus] = useState<ArtworkPaymentStatus>();
  const [creator, setCreator] = useState<Creator>();
  const [tags, setTags] = useState<Tag[]>([]);
  const [user, setUser] = useState<Creator>();
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  const savedAuth = sessionStorage.getItem("auth");
  const savedUser: Creator = savedAuth ? JSON.parse(savedAuth) : null;

  const [loading, setLoading] = useState(false);
  const [openArtShopConfirm, setOpenArtShopConfirm] = useState(false);
  const [openDownload, setOpenDownload] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDowload, setOpenDowload] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const getArtWork = async () => {
      setLoading(true);
      const artworkbyid = await GetArtById(id ? id : "1");
      // console.log('artwork by id: '+artworkbyid?.creatorID);

      try {
        const response = await axios.put(
          `http://localhost:7233/api/artworks/increment-views/${artworkbyid.artworkID}/${savedUser.userId}`
        );
        console.log("View incremented on direct access:", response.data);
        // Đánh dấu đã gọi API tăng view cho artwork này trong session
      } catch (error) {
        console.error("Error incrementing view on direct access:", error);
      }

      if (!artworkbyid) {
        setLoading(false);
        return;
      }
      setArtwork({ ...artworkbyid, idDowLoad: "" });
      // const paystatus = await GetArtsPaymentStatus(
      //     savedUser?.userId,
      //     artworkbyid.artworkID
      // );
      // setStatus(paystatus);
      const creator = await GetCreatorByID(artworkbyid ? artworkbyid.creatorID : "1");
      // console.log('Creator ID:', artworkbyid.creatorID);
      // console.log('test'+creator);
      setCreator(creator);
      setLoading(false);
    };
    getArtWork();
  }, [id]);

  useEffect(() => {
    const getTags = async () => {
      let tags: Tag[] | undefined = await GetTagByArtId(id ? id : "0");
      setTags(tags ? tags : []);
    };
    getTags();
  }, [id]);

  const handleClick = () => {
    console.info("You clicked the Chip.");
  };

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleOpenArtShopConfirm = () => {
    setOpenArtShopConfirm(!openArtShopConfirm);
  };

  const handleOpenReport = () => {
    setOpenReport(!openReport);
  };

  // Handle Download Artwork
  const handleClose = () => {
    setOpenArtShopConfirm(false);
    setOpenDownload(false);
    setOpenReport(false);
  };

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
    await downloadSectionAsImage(artwork?.idDowLoad);
  };

  const handleDownload = async (id: string) => {
    if (!artwork?.artworkID) return; // Nếu artworkID không có, không tiếp tục

    const downloadArtwork: DownloadArtwork = {
      ...artwork,
      idDowLoad: id,
      artworkID: artwork.artworkID ?? "", // Nếu artworkID là undefined, gán một giá trị mặc định
    };

    setArtwork(downloadArtwork);
    setOpenDowload(true);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await DeleteArtById(artwork?.artworkID ?? "");
      console.log(response.data);
      setLoading(false);
      navigate(`/characters/profile/${savedUser?.accountId}`);
      console.log();
    } catch (err) {
      console.log(err);
    }
  };
  function formatMoney(amount) {
    amount *= 1000;
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }

  const handleClickOpen = () => {
    setOpenArtShopConfirm(true);
  };

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const getUserProfile = async () => {
      const userProfile = await GetCreatorByAccountID(id ? id : "0");
      setUser(userProfile);
    };
    const getUserArtworks = async () => {
      const userArtworks = await GetArtsByAccountId(id ? id : "0");
      setArtworks(userArtworks ? userArtworks : []);
    };
    getUserProfile();
    getUserArtworks();
  }, [id]);

  function TagList() {
    return (
      <>
        {tags.map((tag, index) => (
          <div key={tag.tagID} className="tag-item">
            <Stack direction="row" spacing={1}>
              <Chip
                label={tag.tagName}
                variant="filled"
                onClick={handleClick}
                style={{
                  backgroundColor: colors[index % colors.length],
                  marginBottom: "5px",
                  color: "white",
                  fontSize: "1rem",
                }}
              />
            </Stack>
          </div>
        ))}
      </>
    );
  }
  return (
    <Box sx={{ paddingTop: "2%" }}>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 100 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {openDowload && <ArtShopDialog open={openDowload} handleClose={handleClose} handleYesClick={handleYesClick} />}
      <div
        className="poswork"
        style={{
          backgroundColor: theme.backgroundColor,
          paddingBottom: "50px",
          color: theme.color,
        }}>
        {/* thong tin nguoi dung */}
        <div className="info-postwork">
          {artwork?.purchasable ? <Watermark /> : ""}
          <div className="imgpost" style={{ backgroundColor: theme.hoverBackgroundColor }}>
            <img
              id={`img-${artwork?.artworkID}`}
              style={{ pointerEvents: artwork?.purchasable ? "none" : "auto" }}
              alt={artwork?.artworkName}
              src={artwork?.imageFile}
            />
          </div>
          <Divider orientation="vertical" />
          <div className="contentpost">
            <Link to={`/characters/profile/${creator?.accountId}`} className="infor-user-post">
              <div className="avatar-user-post">
                <Stack direction="row" spacing={2}>
                  <Avatar src={creator?.profilePicture} sx={{ width: 50, height: 50 }} />
                </Stack>
              </div>
              <div className="name-user-post" style={{ color: "#1565C0" }}>
                {creator?.firstName + " " + creator?.lastName}
              </div>
            </Link>

            <div className="content-post-img">
              <div>
                <FontAwesomeIcon
                  icon={faSignature}
                  style={{ marginRight: "5px", fontSize: "18px", color: "#1565C0" }}
                />
                Name: {artwork?.artworkName}
              </div>
              <div>
                <FontAwesomeIcon
                  icon={faCalendarDays}
                  style={{ marginRight: "5px", fontSize: "18px", color: "#1565C0" }}
                />
                Posted date: {artwork?.dateCreated}
              </div>

              <div>
                <FontAwesomeIcon icon={faEye} style={{ marginRight: "5px", fontSize: "18px", color: "#1565C0" }} />
                View: {artwork?.views}
              </div>

              <div>
                <FontAwesomeIcon icon={faHeart} style={{ marginRight: "5px", fontSize: "18px", color: "#E53935" }} />
                Like: {artwork?.likes}
              </div>

              <div>
                <FontAwesomeIcon icon={faComments} style={{ marginRight: "5px", fontSize: "18px", color: "#1565C0" }} />
                Comment: {artwork?.comments}
              </div>

              <div>
                <FontAwesomeIcon
                  icon={faMoneyBillWave}
                  style={{ marginRight: "5px", fontSize: "18px", color: "#1565C0" }}
                />
                Price: {artwork?.price === 0 ? "Free" : formatMoney(artwork?.price)}
              </div>

              <h4 style={{ marginBottom: "5px", marginTop: "10px" }}>
                <FontAwesomeIcon icon={faTags} style={{ marginRight: "8px", fontSize: "18px", color: "#1565C0" }} />
                Tags:
              </h4>
              <div className="tag-container">{tags.length !== 0 ? <TagList /> : ""}</div>

              <div>
                <FontAwesomeIcon
                  icon={faCircleInfo}
                  style={{ marginRight: "5px", fontSize: "18px", color: "#1565C0" }}
                />
                Description: {artwork?.description}
              </div>
            </div>
          </div>
        </div>
        <Box className="comment-section">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "60%",
            }}>
            <LikeIcon userID={savedUser?.userId} artworkID={id} />
            <FavouritesIcon userID={savedUser?.userId} artworkID={id} />
            <div className="button-comment">
              <a href="#comment" style={{ display: "flex" }}>
                <CommentIcon sx={{ color: theme.color, fontSize: 35, marginRight: "5px" }} />
                <h4 style={{ paddingTop: "5px" }} className="addfavourite">
                  Comment
                </h4>
              </a>
            </div>
            {creator?.accountId === savedUser?.accountId ? (
              <>
                <Button
                  onClick={handleDelete}
                  color="error"
                  variant="contained"
                  style={{
                    color: "white",
                    height: "50px",
                    margin: "10px",
                  }}>
                  Delete Artwork
                </Button>
                <Link to={`/characters/artwork/update/${artwork?.artworkID}`}>
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: "#5dbae5",
                      color: "white",
                      height: "50px",
                      margin: "10px",
                    }}>
                    Update Artwork
                  </Button>
                </Link>
              </>
            ) : (
              <div style={{ margin: "auto 5px" }}>
                {artwork?.purchasable === true && status?.status === false ? (
                  <Chip
                    label={formatMoney(artwork?.price)}
                    onClick={handleOpenArtShopConfirm}
                    style={{
                      fontSize: "20px",
                      padding: "20px",
                      fontWeight: "600",
                      backgroundColor: "#61dafb",
                    }}
                  />
                ) : (
                  <>
                    <Button
                      sx={{ minWidth: "40%", marginBottom: "5px", height: "40px" }}
                      variant="contained"
                      size="small"
                      title="Dowload"
                      onClick={() => handleDownload(`img-${artwork?.artworkID}`)}
                      endIcon={<Download />}>
                      Download Artwork
                    </Button>

                    <Button
                      sx={{ minWidth: "20%", marginBottom: "5px", height: "40px" }}
                      onClick={handleOpenReport}
                      variant="contained"
                      color="error"
                      href=""
                      style={{ marginLeft: "20px" }}>
                      Report
                    </Button>
                  </>
                )}
              </div>
            )}
            {/* {userInSession.accountId !== creator?.userId ? (

            ) : (
              ""
            )} */}

            {/* Popup Report */}
            <Dialog
              open={openReport}
              onClose={handleClose}
              className="dialog-custom" // Áp dụng class từ ArtPost.css
              BackdropProps={{
                sx: {
                  backgroundColor: "rgba(0, 0, 0, 0.5)", // Lớp phủ mờ
                },
              }}>
              <ReportForm
                reporterId={Number(userInSession.userId)}
                reportedId={Number(creator?.userId)}
                artworkId={Number(artwork?.artworkID)}
                onClose={() => setOpenReport(false)}
              />
            </Dialog>
          </div>
          <div id='"#comment"'>
            <Comments />
          </div>
        </Box>
      </div>
      {openArtShopConfirm && (
        <ArtShopConfirm open={openArtShopConfirm} handleClose={handleOpenArtShopConfirm} item={artwork ?? null} />
      )}
    </Box>
  );
}
