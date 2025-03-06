import { ThemeContext } from '../Themes/ThemeProvider.tsx';
import Box from '@mui/material/Box';
import '../../css/YourCommission.css';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField'; // Sử dụng TextField của MUI
import { commission } from '../../share/Commission.js';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios'; // Thêm axios để gọi API
import { Creator } from '../../Interfaces/UserInterface.ts';
import { ICommissionForm, IExtraCommissionForm } from '../../Interfaces/CommissionForm.ts';
import { PutCommissionFormById } from '../../API/CommissionAPI/PUT.tsx';

// Định nghĩa CommissionStepper trước khi sử dụng trong YourCommission
function CommissionStepper({ currentCommission }: { currentCommission: IExtraCommissionForm }) {
  const steps = ['Confirm Commission', 'Drawing', 'Submit Confirmation', 'Commission Completed!'];
  const [activeStep, setActiveStep] = useState(currentCommission.progress);
  const [loading, setLoading] = useState(false);

  const updateProgress = async (commissionId: number, progress: number) => {
    try {
      const response = await axios.put(
        `http://localhost:7233/api/commissions/${commissionId}/progress`,
        null,
        {
          params: {
            progress: progress,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      console.log('Progress update response:', response.data);
      console.log('Progress update status:', response.status);
      return response.data;
    } catch (err) {
      console.error('Error updating progress:', err);
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        console.error('Response headers:', err.response.headers);
        throw new Error(`Failed to update progress: ${err.response.data.message || 'Unknown error'}`);
      } else if (err.request) {
        console.error('No response received:', err.request);
        throw new Error('No response from server. Please check the connection.');
      } else {
        console.error('Error setting up request:', err.message);
        throw new Error('Error setting up request. Please try again.');
      }
    }
  };

  const handleNext = async () => {
    try {
      setLoading(true);
      const newProgress = activeStep + 1;
      if (newProgress > 4) {
        throw new Error('Progress cannot exceed 4 (Commission Completed)');
      }
      setActiveStep(newProgress);
      await updateProgress(currentCommission.commissionID, newProgress);
      console.log("Forward 1 step: Progress updated to " + newProgress);
    } catch (err) {
      console.error(err.message);
      setActiveStep(currentCommission.progress); // Rollback nếu có lỗi
    } finally {
      setLoading(false);
    }
  };

  const handleBack = async () => {
    try {
      setLoading(true);
      const newProgress = activeStep - 1;
      if (newProgress < 0) {
        throw new Error('Progress cannot be less than 0');
      }
      setActiveStep(newProgress);
      await updateProgress(currentCommission.commissionID, newProgress);
      console.log("Backward 1 Step: Progress updated to " + newProgress);
    } catch (err) {
      console.error(err.message);
      setActiveStep(currentCommission.progress); // Rollback nếu có lỗi
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', scale: "100%", height: "auto" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            Commission completed - you're finished
          </Typography>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0 || loading}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button
              onClick={handleNext}
              disabled={activeStep === 4 || loading}
            >
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}

export default function YourCommission() {
  const { theme } = useContext(ThemeContext);
  const [commissionList, setCommissionList] = useState<IExtraCommissionForm[]>([]);
  const [refreshForm, setRefreshForm] = useState(false); // Sửa tên setreFreshForm thành setRefreshForm cho nhất quán
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [rejectMessage, setRejectMessage] = useState(''); // State để lưu lý do từ chối
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false); // State để mở dialog nhập lý do từ chối
  const [selectedCommission, setSelectedCommission] = useState<IExtraCommissionForm | null>(null); // Commission đang được từ chối
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Lấy thông tin user từ sessionStorage
  const savedAuth = sessionStorage.getItem('auth');
  const savedUser: Creator = savedAuth ? JSON.parse(savedAuth) : null;
  console.log('Saved user:', savedUser);

  // Chuyển hướng nếu không có user
  if (savedUser === null) {
    navigate('/');
  }

  useEffect(() => {
    if (rejectDialogOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [rejectDialogOpen]);

  // Gọi API để lấy tất cả commission và lọc theo receiverID của người dùng hiện tại
  useEffect(() => {
    const getCommissionForm = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:7233/api/commissions');
        console.log('Commission response:', response.data);
        const commissions: IExtraCommissionForm[] = response.data
          .map((commission: any) => ({
            commissionID: commission.commissionID,
            receiverID: commission.receiver,
            requestorID: commission.requestor,
            description: commission.description,
            accept: commission.accept,
            progress: commission.progress,
            requestorEmail: commission.email,
            requestorPhone: commission.phoneNumber,
            requestorUserName: '', // Cần lấy từ bảng User nếu có, hiện tại để trống
            creationDate: commission.creationDate,
            acceptanceDate: commission.acceptanceDate,
            completionDate: commission.completionDate,
            message: commission.message || '', // Thêm message từ API nếu có
          }))
          .filter((commission: IExtraCommissionForm) => commission.receiverID === savedUser.userId); // Lọc theo receiverID
        setCommissionList(commissions);
      } catch (error) {
        console.error('Error fetching commissions:', error);
      } finally {
        setLoading(false);
      }
    };
    getCommissionForm();
  }, [refreshForm, open, navigate, savedUser.userId]); // Thêm savedUser.id vào dependency array

  // Xử lý Accept commission (gửi accept = true khi nhấn Accept)
  const handleAccept = async (commission: IExtraCommissionForm) => {
    console.log('Accepting commission:', commission);
    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:7233/api/commissions/${commission.commissionID}/accept`,
        null,
        {
          params: {
            accept: true,
            message: '',
            acceptanceDate: null,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
      console.log('API response:', response.data);
      console.log('API status:', response.status);
      setRefreshForm(prev => !prev);
    } catch (err) {
      console.error('Error accepting commission:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mở dialog để nhập lý do từ chối trước khi hủy
  const handleRejectOpen = (commission: IExtraCommissionForm) => {
    setSelectedCommission(commission);
    setRejectDialogOpen(true);
    setRejectMessage('');
  };

  // Xử lý từ chối commission với lý do
  const handleRejectSubmit = async () => {
    if (!selectedCommission) return;
    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:7233/api/commissions/${selectedCommission.commissionID}/accept`,
        null,
        {
          params: {
            accept: false,
            message: rejectMessage || '',
            acceptanceDate: null,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      console.log('Reject response:', response.data);
      console.log('Reject status:', response.status);
      setRefreshForm(prev => !prev);
      setRejectDialogOpen(false);
      setSelectedCommission(null);
      setRejectMessage('');
    } catch (err) {
      console.error('Error rejecting commission:', err);
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        console.error('Response headers:', err.response.headers);
      } else if (err.request) {
        console.error('No response received:', err.request);
      } else {
        console.error('Error setting up request:', err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Đóng dialog từ chối
  const handleRejectClose = () => {
    setRejectDialogOpen(false);
    setSelectedCommission(null);
    setRejectMessage('');
  };

  // MUI Dialog cho từ chối
  const RejectDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

  // MUI Dialog cho tiến trình
  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

  const [currentSelect, setCurrentSelect] = useState<IExtraCommissionForm | null>(null);
  const handleClickOpen = (commission: IExtraCommissionForm) => {
    setOpen(true);
    console.log("Opening dialog for commission:", commission);
    setCurrentSelect(commission);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentSelect(null);
  };

  return (
    <div className='yourCommission'>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box className='box'
        sx={{
          color: theme.color,
          backgroundColor: `rgba(${theme.rgbBackgroundColor},0.97)`,
          transition: theme.transition,
          width: '85%',
          margin: 'auto',
          borderRadius: '5px',
          marginBottom: '15px',
          minHeight: '800px'
        }}>
        <h1>Your Commissions:</h1>
        <Divider variant='middle' sx={{ borderColor: theme.color }} />
        <div className='listcommission' style={{ width: '100%', display: 'flex', justifyContent: 'center', paddingBottom: '40px' }}>
          <List sx={{ width: '100%', maxWidth: 1000, bgcolor: 'background.paper' }}
            style={{
              borderTop: '1px solid black', borderLeft: '1px solid black', borderRight: '1px solid black',
              borderRadius: '10px',
              padding: 0,
              marginBottom: '50px',
              marginTop: '30px'
            }}>
            {commissionList.map((commission: IExtraCommissionForm) => (
              <div key={commission.commissionID}>
                <ListItem alignItems="flex-start">
                  <div className='onecommission'>
                    <div className='content'>
                      <ListItemText>
                        <div className='header' style={{ display: 'flex', marginBottom: '5px' }}>
                          {commission.accept === null && (
                            <Avatar style={{ background: theme.color }}><NotificationsActiveIcon /></Avatar>)}
                          {commission.accept === true && (
                            <Avatar style={{ background: '#10AF27' }}><CheckIcon /></Avatar>)}
                          {commission.accept === false && (
                            <Avatar style={{ background: 'red' }}><ClearIcon /></Avatar>
                          )}
                          <h3 style={{ margin: 'auto 15px' }}>
                            You Got A Commission
                          </h3>
                        </div>
                        <div className='contentcommission'>
                          <div>
                            <div>
                              <Typography variant='h6'>Phone: {commission.requestorPhone}</Typography>
                              <Typography variant='h6'>Email: {commission.requestorEmail}</Typography>
                              <Typography variant='body1' style={{ fontWeight: 'bold' }}>Description: </Typography>
                              <span>{commission.description}</span>
                              <Typography variant='body1' style={{ fontWeight: 'bold' }}>Creation Date: </Typography>
                              <span>{commission.creationDate || 'Not set'}</span>
                              <br />
                              <Typography variant='body1' style={{ fontWeight: 'bold' }}>Acceptance Date: </Typography>
                              <span>{commission.acceptanceDate === null && commission.accept === null ? 'Not yet' : commission.acceptanceDate === null && commission.accept !== null ? 'Not Accepted' : commission.acceptanceDate}</span>
                              <br />
                              <Typography variant='body1' style={{ fontWeight: 'bold' }}>Completion Date: </Typography>
                              <span>{commission.completionDate || 'Not completed'}</span>
                              {commission.message && (
                                <Typography variant='body2' color="red" style={{ fontWeight: 'bold' }}>
                                  Rejection Reason: {commission.message}
                                </Typography>
                              )}
                            </div>
                          </div>
                        </div>
                      </ListItemText>
                    </div>
                    <div className='button'>
                      {commission.accept === null && (
                        <>
                          <Button variant="contained" style={{ marginRight: '20px' }} onClick={() => handleAccept(commission)}>Accept</Button>
                          <Button variant="contained" style={{ marginRight: '20px' }} color='error' onClick={() => handleRejectOpen(commission)}>Reject</Button>
                        </>
                      )}
                      {commission.accept === true && (
                        <Button variant="contained" onClick={() => handleClickOpen(commission)}>Track the progress</Button>
                      )}
                      {commission.accept === false && (
                        <Button style={{ paddingRight: '40px', paddingLeft: '40px' }} variant="contained" disabled>Rejected</Button>
                      )}
                    </div>
                  </div>
                </ListItem>
                <Divider component="li" style={{ backgroundColor: 'black' }} />
              </div>
            ))}
          </List>
        </div>

        {/* Dialog để từ chối */}
        <RejectDialog
          onClose={handleRejectClose}
          aria-labelledby="reject-dialog-title"
          open={rejectDialogOpen}
          fullWidth={true}
          maxWidth='sm'
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="reject-dialog-title">
            Enter Rejection Reason
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              autoFocus
              margin="dense"
              id="reject-message"
              label="Reason for Rejection"
              type="text"
              fullWidth
              variant="standard"
              value={rejectMessage}
              onChange={(e) => {
                console.log('Input value:', e.target.value);
                setRejectMessage(e.target.value);
              }}
              onFocus={(e) => {
                console.log('TextField focused');
                e.target.select(); // Tự động chọn toàn bộ text khi focus
              }}
              onBlur={(e) => console.log('TextField blurred')} // Log để debug khi mất focus
              inputRef={inputRef}
              inputProps={{ maxLength: 500 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleRejectClose}>Cancel</Button>
            <Button onClick={handleRejectSubmit}>Submit</Button>
          </DialogActions>
        </RejectDialog>

        {/* Dialog để theo dõi tiến trình */}
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
          fullWidth={true}
          maxWidth='md'
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Track the progress
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent dividers>
            {currentSelect && <CommissionStepper currentCommission={currentSelect} />}
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              Save changes
            </Button>
          </DialogActions>
        </BootstrapDialog>
      </Box>
    </div>
  );
}