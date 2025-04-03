import React, { useContext, useEffect } from "react";
import { Work } from "../../share/ListofWork.js";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { useState } from "react";
import { ListofUsers } from "../../share/ListofUsers.js";
import { Link, useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ChatIcon from "@mui/icons-material/Chat";
import PropTypes, { number } from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CakeIcon from "@mui/icons-material/Cake";
import RoomIcon from "@mui/icons-material/Room";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import PhoneIcon from "@mui/icons-material/Phone";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Avatar from "@mui/material/Avatar";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import { SnackbarCloseReason } from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import CustomizedImageButton from "../StyledMUI/CustomizedImageButton.jsx";
import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import { GetCreatorByID, GetCreatorByAccountID } from "../../API/UserAPI/GET.tsx";
import { Creator } from "../../Interfaces/UserInterface.ts";
import { PutCreatorBackgroundPicture, PutCreatorProfilePicture, PutProfile } from "../../API/UserAPI/PUT.tsx";
import { GetArtsByCreatorId, GetArtsByAccountId } from "../../API/ArtworkAPI/GET.tsx";
import { Artwork } from "../../Interfaces/ArtworkInterfaces.ts";
import { PlaceHoldersImageCard } from "./PlaceHolders.jsx";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Background from "../Themes/Background.jsx";
import Grid from "@mui/material/Grid";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomizedTextField from "../StyledMUI/CustomizedTextField.tsx";
import Snackbar from "@mui/material/Snackbar";
import LoadingScreen from "../LoadingScreens/LoadingScreenSpokes.jsx";
import { PostCreator, PostUserAccount, PostFollowUser } from "../../API/UserAPI/POST.tsx";
import { PutChangePassword } from "../../API/UserAPI/PUT.tsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import CheckIcon from "@mui/icons-material/Check";
import { parse } from "date-fns/parse";
import "../../css/ArtPost.css";
import "../../css/ProfileUser.css";

import ReportForm from "./UserForms/ReportForm.tsx"; // Import form bạn đã làm
import { Report } from "../../Interfaces/ReportInterfaces.ts";
import { Favorite } from "@mui/icons-material";
import FavouritesArtwork from "./FavouritesArtwork.tsx";

import { Follow } from "../../Interfaces/FollowingInterface";
import { DeleteFollowUser } from "../../API/UserAPI/DELETE.tsx";
import { CheckFollowStatus } from "../../API/UserAPI/GET.tsx";
import CommissionForm from "./CommissionForm.tsx";
import { Chat, Message } from "../../Interfaces/ChatInterfaces.ts";
import { createChat } from "../../API/ChatAPT/POST.tsx";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
      <div
          role="tabpanel"
          hidden={value !== index}
          id={`simple-tabpanel-${index}`}
          aria-labelledby={`simple-tab-${index}`}
          {...other}>
        {value === index && (
            <Box sx={{ p: 3 }}>
              <Typography component="div">{children}</Typography>
            </Box>
        )}
      </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function ProfileUser() {
  const [showCommissionForm, setShowCommissionForm] = useState(false);

  // Attempt to retrieve the auth state from sessionStorage
  const savedAuth = sessionStorage.getItem("auth");
  // Check if there's any auth data saved and parse it
  const userInSession: Creator = savedAuth ? JSON.parse(savedAuth) : "";
  // Now 'auth' contains your authentication state or null if there's nothing saved
  // HANDLE CHANGE PASSWORD

  const [snackbarChangePassword, setSnackbarChangePassword] = useState(false);
  const [snackbarChangePasswordError, setSnackbarChangePasswordError] = useState(false);

  const snackbarChangePasswordAutoClose = (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarChangePassword(false);
    setSnackbarChangePasswordError(false);
  };

  // Account Change Password Started Here!
  const formik = useFormik({
    validateOnChange: false,
    validateOnBlur: false,
    initialValues: {
      OldPassword: "",
      NewPassword: "",
      ConfirmPassword: "",
    },

    validationSchema: Yup.object({
      OldPassword: Yup.string().required("What? Don't remember the password?").min(5, "Must be 5 characters or more"),
      NewPassword: Yup.string()
          .required("Password! Or we're gonna steal your account.")
          .min(5, "Must be 5 characters or more"),
      ConfirmPassword: Yup.string()
          .required("Goldfish? Type a new password again.")
          .min(5, "Must be 5 characters or more"),
    }),

    onSubmit: (values) => {
      if (values.ConfirmPassword !== values.NewPassword) {
        alert("New Password and Submit Password are not the same!");
      } else {
        let checkChangePassword;
        const ChangePass = async () => {
          try {
            checkChangePassword = await PutChangePassword({
              email: userInSession?.email,
              oldPassword: values.OldPassword,
              newPassword: values.NewPassword,
            });

            if (String(checkChangePassword) === "1") {
              setSnackbarChangePassword(true);
            } else {
              setSnackbarChangePasswordError(true);
            }
          } catch (err) {
            if (checkChangePassword === "2") setSnackbarChangePasswordError(true);
            console.log(err);
          }
        };
        ChangePass();
      }
    },
  });

  // |||||||||----END-CHANGE-PASSWORD----||||||||

  // EDIT PROFILE

  const F4k = useFormik({
    validateOnChange: false,
    validateOnBlur: false,
    initialValues: {
      firstName: userInSession?.firstName,
      biography: userInSession?.biography,
      address: userInSession?.address,
      lastName: userInSession?.lastName,
      date: userInSession?.dateOfBirth,
      phoneNumber: userInSession?.phoneNumber,
    },

    validationSchema: Yup.object({
      firstName: Yup.string().max(255,"255 characters only, please!"),
      lastName: Yup.string().max(255,"255 characters only, please!"),
      date: Yup.date()
          .transform(function (value, originalValue) {
            if (this.isType(value)) {
              return value;
            }
            const result = parse(originalValue, "dd/MM/yyyy", new Date());
            return result;
          })
          .typeError("please enter a valid date")
          .max(new Date().getFullYear(), "You can not born in the future!!"),

      address: Yup.string()
      .max(255,"@.@ Shipper will really pissed off by this, 255 characters please!"),
      biography: Yup.string()
      .required("Tell the community something about yourself").
      max(255,"Too much! How famous are you? We only support 255 characters."),
      phoneNumber: Yup.string().required("Please contains your REAL phone to support all feature!")
      .min(8, "Must be at least 8 and no more than 20 numbers")
      .max(20,"Must be at least 8 and no more than 20 numbers")
      .matches(/^\d+$/, "That doesn't look like a phone number"),
    }),

    onSubmit: (values) => {
      let checkChangeProfile;
      const EditProfile = async () => {
        try {
          checkChangeProfile = await PutProfile({
            accountId: userInSession?.accountId,
            firstName: values.firstName,
            lastName: values.lastName,
            address: values.address,
            biography: values.biography,
            dateOfBirth: values.date,
            phoneNumber: values.phoneNumber,
          });

          if (String(checkChangeProfile) === "1") {
            setSnackbarChangePassword(true);
          } else {
            setSnackbarChangePasswordError(true);
          }
        } catch (err) {
          if (checkChangeProfile === "2") setSnackbarChangePasswordError(true);
          console.log(err);
        }
      };
      EditProfile();
    },
  });
  // |||||||||----END-EDIT-PROFILE----|||||||||

  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<Creator>();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [previewProfile, setPreviewProfile] = useState<string>();
  const [previewBackground, setPreviewBackground] = useState<string>();
  //Popup Report
  const [reportReason, setReportReason] = useState(""); // Lý do báo cáo
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  let { id } = useParams();
  const { theme } = useContext(ThemeContext);

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const getUserProfile = async () => {
      const userProfile = await GetCreatorByAccountID(id ? id : "0");
      console.log("🟢 Dữ liệu User từ API:", userProfile);

      if (userProfile) {
        console.log(`🔍 Kiểm tra typeID trước khi setState:`, userProfile.typeId);
      }      
      
      setUser(userProfile);

      if ( userInSession.userId &&  userProfile?.userId && userInSession.userId !== userProfile.userId) {
        const response = await axios.get(
            `http://localhost:7233/api/Follow/checkFollow?followerID=${userInSession.userId}&followingID=${userProfile.userId}`
        );
        setIsFollowing(response.data.isFollowing);
      }

    };
    const getUserArtworks = async () => {
      const userArtworks = await GetArtsByAccountId(id ? id : "0");
      setArtworks(userArtworks ? userArtworks : []);
    };
    getUserProfile();
    getUserArtworks();
  }, [id]);

  //Covert Blob to Base64 string to easily view the image
  function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result as string;
        resolve(base64data);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  }

  async function postImageToDatabase(base64Data: string, imageType: string) {
    if (imageType === "profilePicture") {
      let plainBase64Data = base64Data;
      PutCreatorProfilePicture(user ? user.accountId : "1", plainBase64Data);
    } else if (imageType === "backgroundPicture") {
      let plainBase64Data = base64Data;
      PutCreatorBackgroundPicture(user ? user.accountId : "1", plainBase64Data);
    } else {
      console.log("error: POSTING FAILED! Check below for further details:");
    }
  }
  // RESIZED IMAGE MORE THAN 4mb
  function resizeImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const maxFileSize = 4 * 1024 * 1024; // 4MB
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (!event.target || !event.target.result) {
          reject(new Error("FileReader không trả về kết quả."));
          return;
        }
        const result = event.target.result;
        if (typeof result !== "string") {
          reject(new Error("Kết quả của FileReader không phải là string."));
          return;
        }

        const img = new Image();
        img.onload = () => {
          const originalWidth = img.width;
          const originalHeight = img.height;
          // Tính toán scale dựa trên kích thước file (dùng căn bậc hai để giữ tỉ lệ)
          const scale = Math.sqrt(maxFileSize / file.size);
          // Nếu scale >= 1 => file đã nhỏ hơn hoặc bằng 4MB, không cần resize
          if (scale >= 1) {
            resolve(result);
            return;
          }
          const newWidth = Math.floor(originalWidth * scale);
          const newHeight = Math.floor(originalHeight * scale);

          // Tạo canvas và lấy context
          const canvas = document.createElement("canvas");
          canvas.width = newWidth;
          canvas.height = newHeight;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Không thể lấy được canvas context."));
            return;
          }
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
          // Chuyển canvas sang base64
          const base64 = canvas.toDataURL(file.type);
          resolve(base64);
        };
        img.onerror = (err) => reject(err);
        img.src = result;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }
  // END HANDLE MAX SIZED

  const handleImageChange = async (e) => {
    const { name, files } = e.target;
    if (name === "profilePicture" || name === "backgroundPicture") {
      const file = files?.[0];
      if (file) {
        try {
          let base64Image;
          if (file.size > 4 * 1024 * 1024) {
            base64Image = await resizeImage(file);
          } else {
            base64Image = await blobToBase64(file);
          }
          // Match the arguments to the function definition
          await postImageToDatabase(base64Image, name); // Here `name` should be of type 'profilePicture' | 'backgroundPicture'
          if (name === "profilePicture") {
            setPreviewProfile(base64Image);
          } else {
            setPreviewBackground(base64Image);
          }
          console.log("Posting images...");
        } catch (error) {
          console.error("Error posting image to database", error);
        }
      }
    }
  };

  function FreeImage() {
    return (
        <ImageList variant="masonry" cols={3} gap={8}>
          {artworks.map((work) => (
              <Link key={work.artworkID} to={`artwork/${work.artworkID}`}>
                <ImageListItem key={work.artworkID}>
                  <img src={`${work.imageFile}`} alt={work.artworkName} loading="lazy" />
                </ImageListItem>
              </Link>
          ))}
        </ImageList>
    );
  }
  function CostImage() {
    return (
        <ImageList sx={{ width: 1200, height: "auto", overflow: "visible" }} cols={4}>
          {artworks.map((work) => (
              <ImageListItem key={work.artworkID}>
                <Link to={`../artwork/${work.artworkID}`}>
                  <img src={`${work.imageFile}`} alt={work.artworkName} loading="lazy" style={{ height: "200px" }} />
                </Link>
                <ImageListItemBar
                    title={work.price}
                    subtitle={work.artworkName}
                    actionIcon={
                      <IconButton sx={{ color: "rgba(255, 255, 255, 0.54)" }} aria-label={`info about ${user?.userName}`}>
                        <InfoIcon />
                      </IconButton>
                    }
                />
              </ImageListItem>
          ))}
        </ImageList>
    );
  }
  function AllImage() {
    return (
        <ImageList variant="masonry" cols={4} gap={8}>
          {artworks.map((work) => (
              <Link to={`../artwork/${work.artworkID}`}>
                <ImageListItem key={work.artworkID}>
                  <img src={`${work.imageFile}`} alt={work.artworkName} loading="lazy" />
                </ImageListItem>
              </Link>
          ))}
        </ImageList>
    );
  }

  const handleClickOpen1 = () => {
    setOpen1(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClose1 = () => {
    setOpen1(false);
  };
  // Xử lý gửi báo cáo
  const handleSubmitReport = (event) => {
    event.preventDefault();
    if (!reportReason) {
      // Kiểm tra nếu lý do không được điền
      alert("Please enter the reason for reporting.");
      return;
    }
    // Nếu lý do đã được điền, đóng dialog báo cáo và mở dialog báo cáo thành công
    handleClose();
    handleClickOpen1();
    // Thực hiện xử lý gửi báo cáo ở đây
  };

  // Sửa hàm handleClick cho follow
  const handleClick = async () => {
    if (!userInSession.userId || !user?.userId) return;
    setLoading(true);
    try {
      if (isFollowing) {
        // Unfollow
        await DeleteFollowUser(userInSession.userId, user.userId);
        setIsFollowing(false);
        setUser((prev) => (prev ? { ...prev, followerCount: prev.followerCount - 1 } : prev));
      } else {
        // Follow
        const followData: Follow = {
          followerId: userInSession.userId,
          followingId: user.userId,
          dateFollow: new Date().toISOString().split("T")[0],
        };
        await PostFollowUser(followData);
        setIsFollowing(true);
        setUser((prev) => (prev ? { ...prev, followerCount: prev.followerCount + 1 } : prev));
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setLoading(false);
    }
  };



  // HANDLE CHATTING

  const handleChatting = () => {
      const newChat : Chat = {
        chatId : 0,
        user1Id : Number(user?.userId),
        user2Id : Number(userInSession.userId),
        status : 0,
      }

      createChat(newChat);
  }



  return (
      <div className="">
        <div className="headeruser">
          {/* <div className='backgrounduser'>
          <img src={selectedUser.background} alt='Background'></img>
        </div> */}

          <Card sx={{ width: "100%" }}>
            <div
                className="backgrounduser"
                style={{ backgroundImage: `url('${user?.backgroundPicture ? user?.backgroundPicture : previewProfile}')` }}>
              <div
                  className="backgroundPicture"
                  style={{
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    color: "#04a1fd",
                    backgroundColor: "#1A1A2E",
                    borderRadius: "10px",
                    fontSize: "14px",
                    top: "80%",
                    left: "83%",
                    width: "15vw",
                  }}>
                {/* Check to see if User in sesion is the same as the user in view, if yes, they can edit image */}

                {userInSession.accountId === user?.accountId ? (
                    <>
                      <input
                          accept=".png,.jpeg,.jpg,.tif,.gif"
                          style={{ display: "none" }}
                          id={"backgroundPicture"}
                          name={"backgroundPicture"}
                          type="file"
                          onChange={handleImageChange}
                      />
                      <label htmlFor={"backgroundPicture"}>
                        <Button className="button-edit-background" component="span" startIcon={<CameraAltIcon />}>
                          Edit Cover Image
                        </Button>
                      </label>
                    </>
                ) : (
                    ""
                )}
              </div>
            </div>
            <CardContent className="infouser1" sx={{ backgroundColor: theme.backgroundColor, color: theme.color }}>
              <div className="infousername">
                <div className="avataruser">
                  <img
                      style={{ outline: `4px solid ${theme.backgroundColor}` }}
                      src={user?.profilePicture ? user?.profilePicture : previewProfile}
                  />
                  <div className="buttonavatar">
                    <div
                        className="profilePicture"
                        style={{
                          backgroundColor: "none",
                          position: "absolute",
                          top: 10,
                          right: 0,
                          transform: "translate(10%, 100%)",
                          zIndex: 2,
                        }}>
                      {/* Check to see if User in sesion is the same as the user in view, if yes, they can edit image */}
                      {userInSession.accountId === user?.accountId ? (
                          <>
                            <input
                                style={{ display: "none" }}
                                accept=".png,.jpeg,.jpg,.tif,.gif"
                                id={"profilePicture"}
                                name={"profilePicture"}
                                type="file"
                                onChange={handleImageChange}
                            />

                            <label htmlFor={"profilePicture"}>
                              <Button
                                  style={{ color: "white", borderRadius: "150px" }}
                                  component="span" //Component = 'span' allow you to span the lable across the input
                              >
                                <Avatar style={{ outline: "2px solid #fff" }}>
                                  <CameraAltIcon />
                                </Avatar>
                              </Button>
                            </label>
                          </>
                      ) : (
                          ""
                      )}
                    </div>
                  </div>
                </div>
                <div className="headerusername">
                  <Typography gutterBottom variant="h3" component="div" style={{ fontWeight: 700, marginBottom: "5px" }}>
                    <div className="headername">
                      {user?.firstName} {user?.lastName}
                    </div>
                  </Typography>
                  <Typography variant="body2" style={{ fontWeight: 500, fontSize: "18px" }}>
                    Followers: {user?.followerCount}
                  </Typography>
                </div>{" "}
              </div>

              {userInSession.accountId !== user?.accountId ? userInSession && (
                  <div className="buttonheaderuser">
                    {isFollowing == true && (
                        <Button
                            className="follow"
                            style={{ width: "120px", height: "40px" }}
                            variant="contained"
                            href="#contained-buttons"
                            onClick={() => handleClick()}>
                          Following
                        </Button>
                    )}
                    {isFollowing == false && (
                        <Button
                            className="following"
                            style={{ width: "120px", height: "40px" }}
                            variant="contained"
                            href="#contained-buttons"
                            onClick={() => handleClick()}>
                          Follow
                        </Button>
                    )}
                    
                      <Button
                           style={{ width: "120px", height: "40px" , marginLeft : '10px' }}
                           variant="contained"
                           onClick={() => handleChatting()}
                           >
                        Chat
                    </Button>
                 
                    
                  </div>
              ) : (
                  ""
              )}
            </CardContent>
          </Card>
        </div>
        <div className="tabsBackground" style={{ backgroundColor: theme.backgroundColor }}>
          <div className="inforuser2">
            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: "2px solid #ECECEC" }} className="navofuser">
                <div className="navuser">
                  <Tabs
                      value={value}
                      onChange={handleChange}
                      aria-label="basic tabs example"
                      style={{ color: theme.color2, zIndex: "7" }}>
                    <Tab label="Home" {...a11yProps(0)} style={{ color: theme.color2 }} />
                    <Tab label="Shop" {...a11yProps(1)} style={{ color: theme.color2 }} />
                    <Tab label="Favourites" {...a11yProps(2)} style={{ color: theme.color2 }} />
                    {userInSession.accountId === user?.accountId ? (
                        <Tab label="Change Password" {...a11yProps(3)} style={{ color: theme.color2 }} />
                    ) : (
                        ""
                    )}
                    {userInSession.accountId === user?.accountId ? (
                        <Tab label="Edit Profile" {...a11yProps(4)} style={{ color: theme.color2 }} />
                    ) : (
                        ""
                    )}
                  </Tabs>
                </div>
                <div className="buttonSubcribe">
                  {/* Kiểm tra RankID chính xác dựa vào API trả về */}
                  {userInSession.accountId !== user?.accountId ? user?.typeId !== 1 ? userInSession && (
                      <Button variant="contained" onClick={() => setShowCommissionForm(true)}>
                        <ShoppingBagIcon style={{ marginRight: "5px" }} />
                        Request an Custom Art
                      </Button>


                  ) : (
                      <Button disabled={true} variant="contained">

                        <ShoppingBagIcon color="inherit" style={{ marginRight: "5px" }} />
                        This person cannot receive commission
                      </Button>
                  ) : ""}

                  {/* Hiển thị form request khi nhấn nút */}
                  {showCommissionForm && <CommissionForm onClose={() => setShowCommissionForm(false)}/>}
                  {userInSession.accountId !== user?.accountId ? userInSession && (
                    
                      <Button
                          onClick={handleClickOpen}
                          variant="contained"
                          color="error"
                          href=""
                          style={{ marginLeft: "20px" }}>
                        Report
                      </Button>
                      
                     
                  ) : (
                      ""
                  )}

                  {/* Popup Report */}
                  <Dialog open={open} onClose={handleClose} className="dialog-custom" // Áp dụng class từ ArtPost.css
                          BackdropProps={{
                            sx: {
                              backgroundColor: "rgba(0, 0, 0, 0.5)", // Lớp phủ mờ
                            },
                          }}>
                    <ReportForm
                        reporterId={Number(userInSession.userId)}
                        reportedId={Number(user?.userId)}
                        // Nếu có artworkId thì truyền vào đây, ví dụ: artworkId={someArtworkId}
                        onClose={() => setOpen(false)}
                    />
                  </Dialog>
                </div>
              </Box>
              <CustomTabPanel value={value} index={0}>
                <div className="tabhome">
                  <div className="biouser">
                    <Box
                        // height= {150}
                        width={350}
                        my={4}
                        gap={4}
                        p={2}
                        style={{
                          color: theme.color2,
                          border: "2px solid grey",
                          top: 0, // this defines the top position when it's sticky
                          zIndex: 10, // you may want to add a zIndex to ensure it stacks on top of other contents
                        }}
                        className="boxintroduct">
                      <h2 className="headintroduct">
                        About {user?.firstName} {user?.lastName}:
                      </h2>
                      <div className="contentintroduct">
                        <CakeIcon className="iconintroduct" />
                        Birthday: {user?.dateOfBirth}{" "}
                      </div>
                      <div className="contentintroduct">
                        <RoomIcon className="iconintroduct" />
                        Location: {user?.address}
                      </div>
                      <div className="contentintroduct">
                        <RssFeedIcon className="iconintroduct" />
                        Last Online: {user?.lastLogin}{" "}
                      </div>
                      <div className="contentintroduct">
                        <PhoneIcon className="iconintroduct" />
                        Phone: {user?.phoneNumber}
                      </div>
                      <div className="contentintroduct">
                        {" "}
                        <AutoAwesomeIcon className="iconintroduct" />
                        My Bio: {user?.biography}{" "}
                      </div>
                    </Box>
                  </div>
                  <div className="workofuser">
                    <div className="head-workofuser">
                      <h2 style={{ color: theme.color2 }}> My Works:</h2>
                      <Box>{artworks.length !== 0 ? <FreeImage /> : <PlaceHoldersImageCard />}</Box>
                    </div>
                  </div>
                </div>
              </CustomTabPanel>

              <CustomTabPanel value={value} index={1}>
                <div style={{ marginLeft: "120px" }}>
                  {artworks.length !== 0 ? <CostImage /> : <PlaceHoldersImageCard />}
                </div>
              </CustomTabPanel>

              <CustomTabPanel value={value} index={2}>
                {/* {artworks.length !== 0 ? <AllImage /> : <PlaceHoldersImageCard />} */}
                {user && <FavouritesArtwork userId={user.userId} />} {/* Truyền userId của người dùng đang xem */}
              </CustomTabPanel>

              {/* THIS IS TABPANEL TO EDIT PROFILE */}
              <CustomTabPanel value={value} index={3}>
                <>
                  <div className="createaccount">
                    <div className="signupForm" style={{ marginTop: "2%" }}>
                      <Box
                          height={"auto"}
                          width={"80%"}
                          my={4}
                          display="flex"
                          alignItems="center"
                          gap={4}
                          p={2}
                          sx={{ backgroundColor: theme.backgroundColor, margin: "auto" }}>
                        <form onSubmit={formik.handleSubmit}>
                          <Grid className="formregister" container spacing={2}>
                            <Grid item xs={12}>
                              <div className="header">
                                <Typography sx={{ color: theme.color }} variant="h4" component="h1" gutterBottom>
                                  Change Password
                                </Typography>
                              </div>
                            </Grid>

                            {/* END OF OTP HANDLE */}
                            <Grid item xs={12}>
                              <CustomizedTextField
                                  id="passwword"
                                  label="Old Password"
                                  name="OldPassword"
                                  type="password"
                                  autoComplete="OldPassword"
                                  fullWidth
                                  value={formik.values.OldPassword}
                                  onChange={formik.handleChange}
                              />
                              {formik.errors.OldPassword && (
                                  <Typography variant="body2" color="red">
                                    {formik.errors.OldPassword}
                                  </Typography>
                              )}
                            </Grid>

                            <Grid item xs={12}>
                              <CustomizedTextField
                                  id="passwword"
                                  label="New Passwword"
                                  name="NewPassword"
                                  type="password"
                                  autoComplete="password"
                                  fullWidth
                                  value={formik.values.NewPassword}
                                  onChange={formik.handleChange}
                              />
                              {formik.errors.NewPassword && (
                                  <Typography variant="body2" color="red">
                                    {formik.errors.NewPassword}
                                  </Typography>
                              )}
                            </Grid>

                            <Grid item xs={12}>
                              <CustomizedTextField
                                  id="firstName"
                                  label="Confirm Password"
                                  name="ConfirmPassword"
                                  type="password"
                                  autoComplete="ConfirmPassword"
                                  fullWidth
                                  value={formik.values.ConfirmPassword}
                                  onChange={formik.handleChange}
                              />
                              {formik.errors.ConfirmPassword && (
                                  <Typography variant="body2" color="red">
                                    {formik.errors.ConfirmPassword}
                                  </Typography>
                              )}
                            </Grid>

                            <Grid item xs={12}>
                              <Button
                                  disabled={open}
                                  variant="contained"
                                  type="submit"
                                  style={{ marginBottom: "20px" }}
                                  fullWidth>
                                Update Password!
                              </Button>
                            </Grid>

                            <Grid item xs={6}>
                              <Link style={{ fontStyle: "italic", color: "grey" }} to={`/forgotpassword`}>
                                {" "}
                                Create an account from the Email? Click here to set the password!
                              </Link>
                            </Grid>
                          </Grid>
                        </form>
                      </Box>
                    </div>
                  </div>
                </>
              </CustomTabPanel>

              {/* THIS IS TABPANEL TO EDIT PROFILE */}
              <CustomTabPanel value={value} index={4}>
                <form onSubmit={F4k.handleSubmit}>
                  <Grid className="formregister" container spacing={2}>
                    <Grid item xs={12}>
                      <div className="header">
                        <Typography sx={{ color: theme.color }} variant="h4" component="h1" gutterBottom>
                          Edit Profile
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <CustomizedTextField
                          id="firstName"
                          label="First Name"
                          name="firstName"
                          autoComplete="email"
                          fullWidth
                          value={F4k.values.firstName}
                          onChange={F4k.handleChange}
                      />
                      {F4k.errors.firstName && (
                          <Typography variant="body2" color="red">
                            {F4k.errors.firstName}
                          </Typography>
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <CustomizedTextField
                          id="lastName"
                          label="Last Name"
                          name="lastName"
                          autoComplete="email"
                          fullWidth
                          value={F4k.values.lastName}
                          onChange={F4k.handleChange}
                      />
                      {F4k.errors.lastName && (
                          <Typography variant="body2" color="red">
                            {F4k.errors.lastName}
                          </Typography>
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      <CustomizedTextField
                          id="address"
                          label="Address"
                          name="address"
                          autoComplete="address"
                          fullWidth
                          value={F4k.values.address}
                          onChange={F4k.handleChange}
                      />
                      {F4k.errors.address && (
                          <Typography variant="body2" color="red">
                            {F4k.errors.address}
                          </Typography>
                      )}
                    </Grid>

                    <Grid item xs={6}>
                      <CustomizedTextField
                          label="Date (yyyy/MM/dd) "
                          name="date"
                          autoComplete="date"
                          fullWidth
                          value={F4k.values.date}
                          onChange={F4k.handleChange}
                      />

                      {F4k.errors.date && (
                          <Typography variant="body2" color="red">
                            {F4k.errors.date}
                          </Typography>
                      )}
                    </Grid>

                    <Grid item xs={6}>
                      <CustomizedTextField
                          id="phoneNumber"
                          label="Phone Number"
                          name="phoneNumber"
                          autoComplete="phoneNumber"
                          fullWidth
                          multiline
                          value={F4k.values.phoneNumber}
                          onChange={F4k.handleChange}
                      />
                      {F4k.errors.phoneNumber && (
                          <Typography variant="body2" color="red">
                            {F4k.errors.phoneNumber}
                          </Typography>
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      <CustomizedTextField
                          id="biography"
                          label="Biography"
                          name="biography"
                          autoComplete="biography"
                          fullWidth
                          multiline
                          rows={3}
                          value={F4k.values.biography}
                          onChange={F4k.handleChange}
                      />
                      {F4k.errors.biography && (
                          <Typography variant="body2" color="red">
                            {F4k.errors.biography}
                          </Typography>
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                          disabled={open}
                          variant="contained"
                          type="submit"
                          style={{ marginBottom: "20px" }}
                          fullWidth>
                        Update Profile!
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </CustomTabPanel>
            </Box>
          </div>
        </div>

        <Snackbar open={snackbarChangePassword} autoHideDuration={2000} onClose={snackbarChangePasswordAutoClose}>
          <Alert onClose={snackbarChangePasswordAutoClose} severity="success" variant="filled" sx={{ width: "100%" }}>
            Change successfully!
          </Alert>
        </Snackbar>

        <Snackbar open={snackbarChangePasswordError} autoHideDuration={2000} onClose={snackbarChangePasswordAutoClose}>
          <Alert onClose={snackbarChangePasswordAutoClose} severity="error" variant="filled" sx={{ width: "100%" }}>
            Change not successfully!
          </Alert>
        </Snackbar>
      </div>
  );
}