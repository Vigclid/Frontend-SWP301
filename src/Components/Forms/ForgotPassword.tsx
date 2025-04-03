
import React, { useContext, useState } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import './FormCSS/CreateAccount.css'
import LoginWithGoogle from '../../Login/Google/LoginWithGoogle.jsx';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik, validateYupSchema } from 'formik';
import * as Yup from "yup";
import axios from "axios"
import Background from '../Themes/Background.jsx';
import { ThemeContext, ThemeProvider } from '../Themes/ThemeProvider.tsx';
import { Account, Creator } from '../../Interfaces/UserInterface.ts';
import { PostChangePassword, PostCreator, PostUserAccount } from '../../API/UserAPI/POST.tsx';
import { GetAccountByEmail } from '../../API/UserAPI/GET.tsx';
import CustomizedSwitch from '../StyledMUI/CustomizedSwitch.jsx'
import { FormControlLabel } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LoadingScreen from '../LoadingScreens/LoadingScreenSpokes.jsx';
import CustomizedTextField from '../StyledMUI/CustomizedTextField.tsx';
import CircularProgress from '@mui/material/CircularProgress';
import CheckIcon from '@mui/icons-material/Check';

let response;

const getOTPURL = 'http://localhost:7233/api/Account/send-token'


function LoginAsGuest() {
  const { theme } = useContext(ThemeContext)
  return (
    <>
      <Grid item xs={12} sx={{ textAlign: 'center', paddingBottom: '5%' }}>
        <Divider sx={{ "&::before, &::after": { backgroundColor: theme.color } }} variant='middle'>
          <Typography variant='h6' sx={{color:theme.color}}>Alternative</Typography>
        </Divider>
        <Link className='guestBtn' style={{ fontStyle: "italic", color: "grey" }} to={`/`}>Already Have An Account? Login Here!</Link>
      </Grid>
    </>
  )
}
const switchCustomText = (
  <Typography color='error' sx={{ display: "flex" }}>
    Happy Working <FavoriteIcon color='error' />
  </Typography>
)
export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [commission, setCommission] = useState(false)
  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setCommission(type === 'checkbox' ? checked : value);
  };
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  // Call this function when the form is submitted successfully
  const handleOpenSnackbar = () => {
    setOpen(true);
  };
  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    // Ignore close events from clicking away
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    navigate('/')
  };
  // Account Creation Started Here!
  const { theme } = useContext(ThemeContext)
  const formik = useFormik({
    validateOnChange: false,
    validateOnBlur: false,
    initialValues: {
      email: "",
      firstName: "",
      password: ""
    },

    onSubmit: (values) => {
      if (values.firstName !== values.password) {
        alert("New Password and Submit Password are not the same!")
      } else {
            let checkChangePassword 
            const PostAccount = async () => {
                try {
                setIsLoading(true)
                checkChangePassword = PostChangePassword({
                    newPassword : values.password,
                    email: values.email
                    },)
                
                setIsLoading(false)
                
                handleOpenSnackbar()

                } catch (err) {
                    if (checkChangePassword === "2")
                        alert("Your email might be not sign up before!")
                console.log(err)
                
                }
        }
        PostAccount()
        }
    },

    validationSchema: Yup.object({
      email: Yup.string().email('Are you sure this is a REAL email address?').required("Hey! Where's the email, pal?").max(255,"No no, there are no email longer than 255 characters"),
      password: Yup.string()
              .required("Password! Or we gonna steal your account.")
              .min(6, "Must be 6 characters or more").max(255,"It's stronger than everything I known, my system also, max is 255 characters."),
      firstName: Yup.string()
      .required("Password! Or we gonna steal your account.")
      .min(6, "Must be 6 characters or more").max(255,"It's stronger than everything I known, my system also, max is 255 characters."),
   
    }),
  })



  //XỬ LÝ OTP
  const [otp, setOtp] = useState<string>('');
  const [activeOTP,setActiveOTP] = useState<boolean>(false);
  const [otpButton,setOtpButton] = useState<boolean>(true);

  // Hàm xử lý khi nhập vào ô TextField
  const handleOTPChange = (event) => {
    const value = event.target.value;
    // Chỉ cho phép nhập số và giới hạn tối đa 6 ký tự
    if (/^\d{0,6}$/.test(value)) {
      setOtp(value);
    }
  };

  // Hàm xử lý khi nút SEND CODE được bấm
  const [load,setLoad] = useState<boolean>(false);
  
  const handleSendCode = async() => {

    const emailSchema = Yup.string()
    .email("Are you sure this is a REAL email address?")
    .required("Hey! Where's the email, pal?")
    .max(250, "No no, there are no email longer than 250 characters");

  try {
      await emailSchema.validate(formik.values.email);
      
      const headers = {
        'Content-Type': 'application/json',
      };
      
      
      if (otpButton) {
        setLoad(true);
        response = await axios.post(`${getOTPURL}`, {'email':formik.values.email}, { headers }); //GET OTP FROM SERVER

        setOtpButton(false);
        setLoad(false);
      } else {

        if (String(response.data) === String(otp)) {
          setActiveOTP(true);
        } else {
          formik.setErrors({ email: 'Wrong OTP!' });
          setTimeout(() => {
            formik.setErrors({ email: '' });
          }, 2000);
        }
      }
  } catch (err) {
      formik.setErrors({ email: err.errors });
        // Xóa lỗi sau 5 giây
        setTimeout(() => {
          formik.setErrors({ email: '' });
        }, 2000);
  }

};





  return (
    <Background>
       {isLoading ? <LoadingScreen />  : ""}
      <div className='createaccount'>
        <div className='signupForm' style={{ marginTop: '2%' }}>
            <Box
              height={'auto'}
              width={'80%'}
              my={4}
              display="flex"
              alignItems="center"
              gap={4}
              p={2}
              sx={{ backgroundColor: theme.backgroundColor, margin: 'auto' }}
            >
              <form onSubmit={formik.handleSubmit}>
                <Grid className='formregister' container spacing={2}>
                  <Grid item xs={12}>
                    <div className='header'>
                      <Typography sx={{color:theme.color}} variant="h4" component="h1" gutterBottom>
                        Forgot Password
                      </Typography></div>
                  </Grid>
                  <Grid item sm={12}>
                    <CustomizedTextField
                      id="email"
                      label="Email"
                      name="email"
                      autoComplete="email"
                      fullWidth
                      value={formik.values.email} onChange={formik.handleChange}
                    />
                    {(formik.errors.email) && (<Typography variant="body2" color="red">{formik.errors.email}
                    </Typography>)}
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
                    <Button
                      variant={activeOTP ?  "contained" : "outlined" }
                      fullWidth
                      onClick={handleSendCode}
                    >
                      {load ? <CircularProgress /> : activeOTP ? <CheckIcon /> : otpButton ? "SEND OTP TO EMAIL" : "ACTIVE"}
                    </Button>
                    
                  </Grid>


                  {/* END OF OTP HANDLE */}
                  <Grid item xs={12}>
                    <CustomizedTextField

                      id="passwword"
                      label="New Password"
                      name="password"
                      type="password"
                      autoComplete="password"
                      fullWidth
                      value={formik.values.password} onChange={formik.handleChange}
                    />
                    {formik.errors.password && (<Typography variant="body2" color="red">{formik.errors.password}
                    </Typography>)}
                  </Grid>

                  <Grid item xs={12}>
                    <CustomizedTextField

                      id="firstName"
                      label="Confirm Password"
                      name="firstName"
                      type="password"
                      autoComplete="email"
                      fullWidth
                      value={formik.values.firstName} onChange={formik.handleChange}
                    />
                    {formik.errors.firstName && (<Typography variant="body2" color="red">{formik.errors.firstName}
                    </Typography>)}
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Button 
                     disabled={open || !activeOTP}
                     variant="contained" 
                     type='submit' 
                     style={{ marginBottom: '20px' }} 
                     fullWidth
                     >
                      ready to explore!
                    </Button>
                  </Grid>
                </Grid>
                <LoginAsGuest />
              </form>
            </Box>
         
        </div>
      </div>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Your form has been submitted successfully!
        </Alert>
      </Snackbar>

    </Background>
  )
}

