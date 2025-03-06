import React, { useState, useEffect } from 'react';
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
import { Creator } from '../../Interfaces/UserInterface.ts';
import { CreateCommissionForm, GetCommissionID } from '../../API/CommissionAPI/POST.tsx';
import { ICommissionForm, ICommissionID } from '../../Interfaces/CommissionForm.ts';

export default function CommissionForm() {
  // reciever is the creator you commission
  const [reciever, setReciever] = useState<Creator | undefined>();
  const [commissionID, setCommissionID] = useState<string | number>();
  const [sendCompleted, setSendCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams<string>(); // Sử dụng kiểu cho useParams
  const navigate = useNavigate();
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
      navigate(`../profile/${id}`);
    }
  };

  const savedAuth = sessionStorage.getItem('auth');
  // Check if there's any auth data saved and parse it
  const user: Creator | null = savedAuth ? JSON.parse(savedAuth) : null;
  // Now 'auth' contains your authentication state or null if there's nothing saved

  useEffect(() => {
    const getReciever = async () => {
      try {
        const recieverData: Creator | undefined = await GetCreatorByID(id ?? "0");
        setReciever(recieverData);
      } catch (error) {
        console.error('Error fetching receiver:', error);
      }
    };
    getReciever();
  }, [id]);

  const formik = useFormik({
    validateOnChange: false,
    validateOnBlur: false,
    enableReinitialize: true,
    initialValues: {
      commissionID: commissionID ?? 0, // Sửa thành number để khớp với ICommissionForm, loại bỏ commissionFormID
      receiverID: reciever?.creatorID ?? 0,
      requestorID: user?.creatorID ?? 0,
      description: "Dear humanity,\nI want to commission you an art about: \nThe requested size will be: \nDue date is: \nFor any further information, please contact me through my email. Thanks!",
      accept: null,
      progress: 0,
    },
    onSubmit: async (values) => {
      const submitCommission = async () => {
        try {
          setLoading(true);
          let id: ICommissionID | undefined = await GetCommissionID();
          let commissionForm: ICommissionForm = {
            ...values,
            commissionID: id?.commissionID ?? 0, // Đảm bảo commissionID là number
          };
          const response = await CreateCommissionForm(commissionForm); // Đảm bảo CreateCommissionForm trả về Promise
          console.log("Commission sent successfully: " + response);
          setSendCompleted(true);
          handleOpenSnackbar();
          setLoading(false);
        } catch (err) {
          setSendCompleted(false);
          setLoading(false);
          console.log("Something is wrong: " + err);
        }
      };
      submitCommission();
    },
    validationSchema: Yup.object({
      description: Yup.string().required("Tell Them What To Do. What's The Deadline. The Schema. Etc."),
    }),
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
          width={700}
          my={4}
          display="flex"
          alignItems="center"
          gap={4}
          p={2}
          sx={{ border: '2px solid grey' }}
          style={{ background: 'whitesmoke', margin: 'auto', paddingLeft: '35px', paddingRight: '35px', marginBottom: '40px', transform: 'translateY(8%)' }}
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
                <TextField
                  className='text'
                  disabled
                  id="userName"
                  label="User Name"
                  fullWidth
                  InputLabelProps={{ style: { color: 'gray' } }}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'gray !important', // Thay đổi màu của viền ngoài khi TextField bị vô hiệu hóa
                    },
                  }}
                  value={reciever?.userName ?? ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className='text'
                  disabled
                  id="phone"
                  label="Phone Contact"
                  value={reciever?.phoneNumber ?? ""}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className='text'
                  disabled
                  id="email"
                  label="Email"
                  value={reciever?.email ?? ""}
                  fullWidth
                />
              </Grid>
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
                {formik.errors.description && (
                  <Typography variant="body2" color="red">{formik.errors.description}</Typography>
                )}
              </Grid>
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
  );
}