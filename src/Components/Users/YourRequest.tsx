import { ThemeContext } from '../Themes/ThemeProvider.tsx';
import Box from '@mui/material/Box';
import '../../css/YourRequest.css';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
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

// Dữ liệu test
const testCommissionList = [
  {
    commissionID: "1",
    requestorUserName: "JohnDoe",
    requestorPhone: "123-456-7890",
    requestorEmail: "johndoe@example.com",
    description: "I need a portrait of my dog in watercolor style.",
    accept: true,
    progress: 2 // Đang ở bước 'Submit Artwork'
  },
  {
    commissionID: "2",
    requestorUserName: "JaneSmith",
    requestorPhone: "987-654-3210",
    requestorEmail: "janesmith@example.com",
    description: "A digital illustration of a fantasy character.",
    accept: false,
    progress: 0 // Chưa được chấp nhận
  },
  {
    commissionID: "3",
    requestorUserName: "AlexBrown",
    requestorPhone: "555-555-5555",
    requestorEmail: "alexbrown@example.com",
    description: "A logo design for my small business.",
    accept: null, // Đang chờ chấp nhận
    progress: 0
  }
];

export default function YourRequest() {
  const { theme } = useContext(ThemeContext);
  const [acceptedItems, setAcceptedItems] = useState(null);
  const [commissionList, setCommissionList] = useState([]);
  const navigate = useNavigate();
  const savedAuth = sessionStorage.getItem('auth');
  const savedUser = savedAuth ? JSON.parse(savedAuth) : null;

  if (savedUser === null) {
    navigate(`/`);
  }

  useEffect(() => {
    // Sử dụng dữ liệu test thay vì gọi API
    setCommissionList(testCommissionList);
  }, []);

  // MUI Dialog
  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (commission) => {
    setOpen(true);
    setAcceptedItems(commission);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // MUI Step
  const steps = ['Accept requests', 'Work in progress', 'Submit Artwork', 'Commission Complete!'];

  return (
    <div className='yourRequest'>
      <Box
        className='box'
        sx={{
          color: theme.color,
          backgroundColor: `rgba(${theme.rgbBackgroundColor},0.97)`,
          transition: theme.transition,
          width: '85%',
          margin: 'auto',
          borderRadius: '5px',
          marginBottom: '15px',
          minHeight: '600px'
        }}
      >
        <h1>Your Request:</h1>
        <Divider variant='middle' sx={{ borderColor: theme.color }} />
        <div className='listcommission' style={{ width: '100%', display: 'flex', justifyContent: 'center', paddingBottom: '40px' }}>
          <List
            sx={{ width: '100%', maxWidth: 1000, bgcolor: 'background.paper' }}
            style={{
              borderTop: '1px solid black',
              borderLeft: '1px solid black',
              borderRight: '1px solid black',
              borderRadius: '10px',
              padding: 0,
              marginBottom: '50px',
              marginTop: '30px'
            }}
          >
            {commissionList.map((commission) => (
              <div key={commission.commissionID}>
                <ListItem alignItems="flex-start">
                  <div className='onecommission'>
                    <div className='content'>
                      <ListItemText>
                        <div className='header' style={{ display: 'flex', marginBottom: '5px' }}>
                          {commission.accept === true ? (
                            <Avatar style={{ background: '#10AF27' }}><CheckIcon /></Avatar>
                          ) : commission.accept === false ? (
                            <Avatar style={{ background: 'red' }}><ClearIcon /></Avatar>
                          ) : (
                            <Avatar style={{ background: theme.color }}><NotificationsActiveIcon /></Avatar>
                          )}
                          <Typography variant='h5' style={{ margin: 'auto 15px' }}>
                            You are requesting a commission from: {commission.requestorUserName}
                          </Typography>
                        </div>
                        <div className='contentcommission'>
                          <div>
                            <Typography variant='body1'>Phone: {commission.requestorPhone}</Typography>
                            <Typography variant='body1'>Email: {commission.requestorEmail}</Typography>
                            <Typography variant='body1' style={{ fontWeight: 'bold' }}> Description: </Typography>
                            <span>{commission.description}</span>
                          </div>
                        </div>
                      </ListItemText>
                    </div>
                    <div className='button'>
                      {commission.accept === true ? (
                        <Button
                          variant="contained"
                          style={{ backgroundColor: '#10AF27' }}
                          onClick={() => handleClickOpen(commission)}
                        >
                          Track the process
                        </Button>
                      ) : commission.accept === false ? (
                        <Button
                          style={{ paddingRight: '40px', paddingLeft: '40px' }}
                          variant="contained"
                          disabled
                        >
                          Commission Declined
                        </Button>
                      ) : (
                        <Button
                          style={{ paddingRight: '40px', paddingLeft: '40px', backgroundColor: '#1976d2', color: 'white' }}
                          variant="contained"
                          disabled
                        >
                          Waiting To Be Accepted
                        </Button>
                      )}
                    </div>
                  </div>
                </ListItem>
                <Divider component="li" style={{ backgroundColor: 'black' }} />
              </div>
            ))}
          </List>
        </div>

        {/* Dialog */}
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
          fullWidth={true}
          maxWidth='md'
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Track the process
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
            <Box sx={{ width: '85%', margin: 'auto', paddingBottom: '30px', paddingTop: '30px' }}>
              <Stepper activeStep={acceptedItems?.progress}>
                {steps.map((label) => {
                  const stepProps = {};
                  const labelProps = {};
                  return (
                    <Step key={label} {...stepProps}>
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
            </Box>
          </DialogContent>
        </BootstrapDialog>
      </Box>
    </div>
  );
}