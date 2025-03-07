import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import '../../css/CommissionForm.css';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { GetCreatorByID } from '../../API/UserAPI/GET.tsx';
import { GetCreatorByAccountID } from '../../API/UserAPI/GET.tsx';
import { Creator } from '../../Interfaces/UserInterface';
import { CreateCommissionForm, GetCommissionID } from '../../API/CommissionAPI/POST.tsx';
import { ICommissionForm, ICommissionID } from '../../Interfaces/CommissionForm.ts';


export default function CommissionForm({ onClose }) {
  //reciever is the creator you commission
  const [reciever, setReciever] = useState<Creator>()
  const [commissionID, setCommissionID] = useState<string | number>()
  const [sendCompleted, setSendCompleted] = useState(false)
  const [loading, setLoading] = useState(false)
  let { id } = useParams()
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
    if (sendCompleted) {
      navigate(`../profile/${id}`)
    }
  };

  const savedAuth = sessionStorage.getItem('auth');
  // Check if there's any auth data saved and parse it
  const user: Creator = savedAuth ? JSON.parse(savedAuth) : null;
  console.log("🟢 User từ sessionStorage:", user);
  // Now 'auth' contains your authentication state or null if there's nothing saved


  // useEffect(() => {
  //   const getUserProfile = async () => {
  //     const user = await GetCreatorByAccountID(id ? id : "0")

  //     console.log("User Profile:", user);

  //     setUser(user)
  //   }
  //   const getUserArtworks = async () => {
  //     const userArtworks = await GetArtsByAccountId(id ? id : "0")
  //     setArtworks(userArtworks ? userArtworks : [])
  //   }
  //   getUserProfile()
  //   getUserArtworks()
  // }, [id])


  useEffect(() => {
      const getReciever = async () => {
        try {
          const fetchedReciever = await GetCreatorByAccountID(id ?? "0");
          console.log("🟢 Người nhận request (Full Data):", fetchedReciever);

          if (fetchedReciever) {
            setReciever(fetchedReciever);
            formik.setFieldValue("receiver", fetchedReciever.userId);
          }
        } catch (error) {
          console.error("❌ Lỗi khi lấy dữ liệu người nhận:", error);
        }
      };

    const fetchCommissionID = async () => {
      try {
        let fetchedCommissionID: ICommissionID | undefined = await GetCommissionID();
        setCommissionID(fetchedCommissionID?.commissionID);
      } catch (error) {
        console.error("Error fetching commission ID:", error);
      }
    };

    getReciever();
    fetchCommissionID();
  }, [id]);


  const formik = useFormik({
    initialValues: {
      requestor: user?.userId ?? "", // Lấy ID người gửi từ session
      receiver: reciever?.userId ?? "", // Lấy ID người nhận từ profile
      phoneNumber: user?.phoneNumber ?? "", // Lấy số điện thoại từ user
      email: user?.email ?? "", // Lấy email từ user
      description: "",
    },
    validationSchema: Yup.object({
      phoneNumber: Yup.string().required("Please enter your phone number"),
      email: Yup.string().email("Invalid email").required("Please enter your email"),
      description: Yup.string().required("Describe your commission request"),
    }),
    onSubmit: async (values) => {
      console.log("🔍 Dữ liệu gửi lên API:", values); // Kiểm tra dữ liệu trước khi gửi API

      if (!values.requestor || !values.receiver) {
        console.error("❌ requestor hoặc receiver bị rỗng! Kiểm tra lại dữ liệu.");
        return;
      }

      try {
        setLoading(true);
        const response = await CreateCommissionForm(values);
        console.log("📨 Phản hồi từ API:", response); // Kiểm tra phản hồi từ API
        if (response) {
          setSendCompleted(true);
          handleOpenSnackbar();
          setTimeout(() => onClose(), 3000);
        } else {
          console.error("❌ API không lưu dữ liệu vào DTB!");
          setSendCompleted(false);
        }
      } catch (error) {
        console.error("🚨 Lỗi khi gửi API:", error);
      } finally {
        setLoading(false);
      }
    }

  });



  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 100 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className='commission'>
        <Box
          //   height=auto
          width={700}
          my={4}
          display="flex"
          alignItems="center"

          //   justifyContent="center"
          gap={4}
          p={2}
          sx={{ border: '2px solid grey' }}
          style={{ background: ' whitesmoke', margin: 'auto', paddingLeft: '35px', paddingRight: '35px', marginBottom: '40px', transform: 'translateY(8%)' }}
        >
          <form onSubmit={formik.handleSubmit}>
            <Grid className='formregister' container spacing={2}>
              <Grid item xs={12}>
                <div className='header'>
                  <Typography variant="h5" component="h1" gutterBottom>
                    Art Commission Request
                  </Typography>
                </div>
              </Grid>

              <Grid item xs={12}>
                <TextField className='text'
                  id="phoneNumber"
                  label="Phone Contact"
                  fullWidth
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField className='text'
                  id="email"
                  label="Email"
                  fullWidth
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  required
                  id="description"
                  label="Description"
                  name="description"
                  autoComplete="description"
                  fullWidth
                  multiline // Thêm thuộc tính multiline
                  rows={5} // Đặt số hàng mong muốn
                  value={formik.values.description}
                  onChange={formik.handleChange}
                />
                <Grid item xs={12}>
                  <div className='note'>*Suggestion: You can fill in the box describing the size of the art and the time you want to complete the work.</div>
                </Grid>
                {formik.errors.description && (<Typography variant="body2" color="red">{formik.errors.description}</Typography>)}
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button variant="contained" type='submit' style={{ marginBottom: '20px' }} fullWidth>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>

        </Box>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={sendCompleted ? "success" : "error"} sx={{ width: '100%' }}>
            {sendCompleted ? "Your form has been submitted successfully!" : "Sending Form Failed!"}
          </Alert>
        </Snackbar>
      </div>
    </>
  )
}
