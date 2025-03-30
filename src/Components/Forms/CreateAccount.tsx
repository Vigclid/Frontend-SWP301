import React, { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import "./FormCSS/CreateAccount.css";
import LoginWithGoogle from "../../Login/Google/LoginWithGoogle.jsx";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Background from "../Themes/Background.jsx";
import { ThemeContext, ThemeProvider } from "../Themes/ThemeProvider.tsx";
import { Account, Creator } from "../../Interfaces/UserInterface.ts";
import { PostCreator, PostUserAccount } from "../../API/UserAPI/POST.tsx";
import { GetAccountByEmail } from "../../API/UserAPI/GET.tsx";
import CustomizedSwitch from "../StyledMUI/CustomizedSwitch.jsx";
import { FormControlLabel } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LoadingScreen from "../LoadingScreens/LoadingScreenSpokes.jsx";
import CustomizedTextField from "../StyledMUI/CustomizedTextField.tsx";
import CircularProgress from "@mui/material/CircularProgress";
import CheckIcon from "@mui/icons-material/Check";
import {getAllAccounts} from "../../API/AccountAPI/GET.tsx";

let response;

const getOTPURL = "http://localhost:7233/api/Account/send-token";

function LoginAsGuest() {
  const { theme } = useContext(ThemeContext);
  return (
    <>
      <Grid item xs={12} sx={{ textAlign: "center", paddingBottom: "5%" }}>
        <Divider sx={{ "&::before, &::after": { backgroundColor: theme.color } }} variant="middle">
          <Typography variant="h6" sx={{ color: theme.color }}>
            Alternative
          </Typography>
        </Divider>
        <Link className="guestBtn" style={{ fontStyle: "italic", color: "grey" }} to={`/`}>
          Already Have An Account? Login Here!
        </Link>
      </Grid>
    </>
  );
}
const switchCustomText = (
  <Typography color="error" sx={{ display: "flex" }}>
    Happy Working <FavoriteIcon color="error" />
  </Typography>
);
export default function CreateAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const [commission, setCommission] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  // Call this function when the form is submitted successfully
  const handleOpenSnackbar = () => {
    setOpen(true);
  };
  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    // Ignore close events from clicking away
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    navigate("/");
  };

  const randomPicture = () => {
    let p1 =
      "https://res.cloudinary.com/djprssm3o/image/upload/v1740558383/avatar/ffa0b63b-fbc8-4e46-8757-145c6ee80161.jpg";
    let p2 =
      "https://res.cloudinary.com/djprssm3o/image/upload/v1740508426/avatar/09ea05ea-a9c6-42f2-9c54-6c39d71967ba.jpg";
    let p3 =
      "https://res.cloudinary.com/djprssm3o/image/upload/v1740508431/background/4b6225fc-1c56-4fec-80ef-54d29e32fd9b.jpg";

    const pictures = [p1, p2, p3];
    const randomIndex = Math.floor(Math.random() * pictures.length);
    return pictures[randomIndex];
  };
  // Account Creation Started Here!
  const { theme } = useContext(ThemeContext);
  const formik = useFormik({
    validateOnChange: false,
    validateOnBlur: false,
    initialValues: {
      profilePicture: randomPicture(),
      backgroundPicture: "",
      paypalAccountID: 1,
      allowCommission: false,
      biography: "",
      role: 2,
      lastName: "",
      firstName: "",
      userName: "",
      phone: "",
      address: "",
      email: "",
      password: "",
    },

    onSubmit: (values) => {
      let account: Account = {
        accountId: "0", // Auto increasement id
        roleID: "2", //Default role as creator (AT)
        email: values.email,
        password: values.password,
        status: false,
      };
      let creator: Creator = {
        CreatorId: "0",
        accountId: "0",
        coins: 0,
        userName: values.userName,
        profilePicture: values.profilePicture,
        backgroundPicture: values.backgroundPicture,
        firstName: values.firstName,
        lastName: values.lastName,
        address: values.address,
        phoneNumber: values.phone,
        lastLogin: undefined,
        CreateAt: undefined,
        dateOfBirth: undefined,
        biography: values.biography,
        allowCommission: commission,
        followCounts: 0,
        followerCount: 0,
        email: values.email,
        RankID: 1,
        RoleID: 2,
      };
      console.log(account);
      console.log(creator);
      const PostAccount = async () => {
        try {
          setIsLoading(true);
          let newAccount = await PostUserAccount(account);
          console.log(`Post Account successfully: ${newAccount}`);
          let creatorWithAccountID = { ...creator, accountID: newAccount ? newAccount.accountId : "1" };
          await PostCreator(creatorWithAccountID);
          console.log(`Post Creator successfully: `);
          setIsLoading(false);
          handleOpenSnackbar();
        } catch (err) {
          console.log(err);
        }
      };
      PostAccount();
    },

    validationSchema: Yup.object({
      userName: Yup.string().required("Must be 6 characters or more.").min(6, "Must be 6 characters or more").max(255,"255 characters please!"),
      email: Yup.string().email('Are you sure this is a REAL email address?').required("Hey! Where's the email, pal?").max(255,"No no, there are no email longer than 255 characters")
                ,
      password: Yup.string()
        .required("Password! Or we gonna steal your account.")
        .min(6, "Must be 6 characters or more").max(255,"It's stronger than everything I known, my system also, max is 255 characters."),
      biography: Yup.string().required("Tell the community something about yourself").max(255,"Too much! How famous are you? We only support 255 characters."),
      phone : Yup.string().required("Please contains your REAL phone to support all feature!")
      .min(8, "Must be at least 8 and no more than 20 numbers")
      .max(20,"Must be at least 8 and no more than 20 numbers")
      .matches(/^\d+$/, "That doesn't look like a phone number"),
      address: Yup.string().max(255,"@.@ Shipper will really pissed off by this, 255 characters please!"),
      firstName : Yup.string().max(255,"255 characters only, please!").required("Tell the community your first name!"),
      lastName : Yup.string().max(255,"255 characters only, please!").required("Tell the community your last name!"),
    }),
  });

  //XỬ LÝ OTP
  const [otp, setOtp] = useState<string>("");
  const [activeOTP, setActiveOTP] = useState<boolean>(false);
  const [otpButton, setOtpButton] = useState<boolean>(true);

  // Hàm xử lý khi nhập vào ô TextField
  const handleOTPChange = (event) => {
    const value = event.target.value;
    // Chỉ cho phép nhập số và giới hạn tối đa 6 ký tự
    if (/^\d{0,6}$/.test(value)) {
      setOtp(value);
    }
  };

  // Hàm xử lý khi nút SEND CODE được bấm
  const [load, setLoad] = useState<boolean>(false);

  const handleSendCode = async () => {
    const emailList: Account[] = await getAllAccounts();
    console.log("list email", emailList);
    const emailValue = formik.values.email;

    if (emailValue) {
      const emailExists = emailList.some((item) => item.email === emailValue);

      if (emailExists) {
        alert("Email already exists!");
        setLoad(false);
        setActiveOTP(false);
        setOtpButton(true);
        return; 
      }

      const headers = {
        "Content-Type": "application/json",
      };

      if (otpButton) {
        setLoad(true);
        try {
          const response = await axios.post(`${getOTPURL}`, { email: emailValue }, { headers }); // GET OTP FROM SERVER
          setOtpButton(false);
        } catch (error) {
          console.error("Error sending OTP:", error);
        } finally {
          setLoad(false); // Đảm bảo tắt chế độ tải dù có lỗi hay không
        }
      } else {
        if (String(response?.data) === String(otp)) {
          setActiveOTP(true);
        } else {
          formik.setErrors({ email: "Wrong OTP!" });
          // Xóa lỗi sau 5 giây
          setTimeout(() => {
            formik.setErrors({ email: "" });
          }, 2000);
        }
      }
    } else {
      formik.setErrors({ email: "Email is required" });
      // Xóa lỗi sau 5 giây
      setTimeout(() => {
        formik.setErrors({ email: "" });
      }, 2000);
    }
  };

  return (
    <Background>
      {isLoading ? <LoadingScreen /> : ""}
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
                      Register Account
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <CustomizedTextField
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                    fullWidth
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.email && (
                    <Typography variant="body2" color="red">
                      {formik.errors.email}
                    </Typography>
                  )}
                </Grid>

                {/* OTP */}

                <Grid item xs={2} container alignItems="center">
                  <CustomizedTextField
                    label="Email OTP"
                    variant="outlined"
                    value={otp}
                    onChange={handleOTPChange}
                    inputProps={{ maxLength: 6 }}
                  />
                </Grid>
                <Grid item xs={2} container alignItems="center">
                  <Button variant={activeOTP ? "contained" : "outlined"} fullWidth onClick={handleSendCode}>
                    {load ? (
                      <CircularProgress />
                    ) : activeOTP ? (
                      <CheckIcon />
                    ) : otpButton ? (
                      "SEND OTP TO EMAIL"
                    ) : (
                      "ACTIVE"
                    )}
                  </Button>
                </Grid>

                {/* END OF OTP HANDLE */}
                <Grid item xs={12}>
                  <CustomizedTextField
                    id="passwword"
                    label="Password"
                    name="password"
                    autoComplete="password"
                    fullWidth
                    value={formik.values.password}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.password && (
                    <Typography variant="body2" color="red">
                      {formik.errors.password}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={6}>
                  <CustomizedTextField
                    id="firstName"
                    label="First Name"
                    name="firstName"
                    autoComplete="email"
                    fullWidth
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.firstName && (
                    <Typography variant="body2" color="red">
                      {formik.errors.firstName}
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
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.lastName && (
                    <Typography variant="body2" color="red">
                      {formik.errors.lastName}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <CustomizedTextField
                    id="userName"
                    label="User Name"
                    name="userName"
                    autoComplete="userName"
                    fullWidth
                    value={formik.values.userName}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.userName && (
                    <Typography variant="body2" color="red">
                      {formik.errors.userName}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <CustomizedTextField
                    id="phone"
                    label="Your Phone"
                    name="phone"
                    autoComplete="phone"
                    fullWidth
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.phone && (
                    <Typography variant="body2" color="red">
                      {formik.errors.phone}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <CustomizedTextField
                    id="address"
                    label="Address (Optional)"
                    name="address"
                    autoComplete="address"
                    fullWidth
                    value={formik.values.address}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.address && (
                    <Typography variant="body2" color="red">
                      {formik.errors.address}
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
                    value={formik.values.biography}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.biography && (
                    <Typography variant="body2" color="red">
                      {formik.errors.biography}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Button
                    disabled={open || !activeOTP}
                    variant="contained"
                    type="submit"
                    style={{ marginBottom: "20px" }}
                    fullWidth>
                    REGISTER
                  </Button>
                </Grid>
              </Grid>
              <LoginAsGuest />
            </form>
          </Box>
        </div>
      </div>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          Your form has been submitted successfully!
        </Alert>
      </Snackbar>
    </Background>
  );
}
