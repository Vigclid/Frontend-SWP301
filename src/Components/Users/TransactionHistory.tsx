
import React from 'react'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../Themes/ThemeProvider.tsx';
import '../../css/TransactionHistory.css'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell , { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import TablePagination from '@mui/material/TablePagination';
import { styled } from '@mui/material/styles';
import { Button, Chip, TextField } from '@mui/material';
import { Order } from '../../share/Order.js';
import { OrderDetailsExtended, OrderHeader } from '../../Interfaces/OrderInterfaces.ts';
import { Creator } from '../../Interfaces/UserInterface.ts';
import { GetOrderDetailByBuyer, GetOrderDetailBySeller, GetOrderHeader } from '../../API/OrderAPI/GET.tsx';
import { Payment } from '../../Interfaces/PaymentIntrerfaces.ts';
import { checkPaymentTransCodeExist, getPaymentsByUserId } from '../../API/PaymentAPI/GET.tsx';
import CustomizedTextField from '../StyledMUI/CustomizedTextField.tsx';
import SendIcon from '@mui/icons-material/Send';
import { useFormik } from 'formik';
import * as Yup from "yup";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import {PostPayment} from "../../API/PaymentAPI/POST.tsx"

// MUI Tab

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
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
    'aria-controls': `simple-tabpanel-${index}`,
  };
}




export default function TransactionHistory() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const savedAuth = sessionStorage.getItem('auth');
  // Check if there's any auth data saved and parse it
  const user: Creator = savedAuth ? JSON.parse(savedAuth) : null;
  // Now 'auth' contains your authentication state or null if there's nothing saved
  const { theme } = useContext(ThemeContext)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderByBuyer, setOrderByBuyer] = useState<OrderDetailsExtended[]>([])
  const [orderBySeller, setOrderBySeller] = useState<OrderDetailsExtended[]>([])
  const [loading, setLoading] = useState(false);
  const [orderHeader, setOrderHeader] = useState<OrderHeader[] | undefined>()

  const [payments, setPayments] = useState<Payment[]>([])
  //Handle button in deposit coin history
  const [checkTransCode,setCheckTransCode] = useState<Boolean>(true);
  const [loadingButton, setLoadingButton] = useState<Boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);



  const navigate = useNavigate();

  useEffect(() => {
    const orderYouBuyandSell = async () => {
      setLoading(true)
      let orderByBuyer: OrderDetailsExtended[] = await GetOrderDetailByBuyer(user?.creatorID)
      setOrderByBuyer(orderByBuyer)
      let orderBySeller: OrderDetailsExtended[] = await GetOrderDetailBySeller(user?.creatorID)
      setOrderBySeller(orderBySeller)
      let orderHeader: OrderHeader[] | undefined = await GetOrderHeader()
      setOrderHeader(orderHeader)
      let paymentsByUserId : Payment[] = await getPaymentsByUserId(user?.userId);
      setPayments(paymentsByUserId);
      setLoading(false)
    }

    orderYouBuyandSell()
  }, [])

  const redirect = (artID) => {
    navigate(`../artwordrecomment/artwork/${artID}`)
  }

  //MUI
  // Handle change page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle change rows per page
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0); // Reset page number back to 0 when changing rows per page
  };


  const formik = useFormik({
    validateOnChange: false,
       validateOnBlur: false,
       initialValues: {
        transCode : "",
       },
   
       validationSchema: Yup.object({
        transCode: Yup.string().required("Requied not empty!")
       }),
   
       onSubmit: (values) => {
        setLoadingButton(true);
        const _checkExists = async () => {
          const AppScirpt = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLjE04cVzXwl8n8mWjcw50NtmsGqaPGh5Xi7wfw1BpWjMmDZLQ0If13bJtyv9ccr6oQ7UbaRsgaFSgdBKB6OMA5JEMzS2YIHNe_yjBur16xzMCzHpVKSI-KNs6g9aVNYj8gxjsg_NZ0IxaE2KmtDiI1S1nbWYUvAs0UKs6LBh4nuL2icG6nF2CdT3rbnXbYLra8L0cmpEoU0X_dsMsolok_FT4U8E8Z9gtxRn1QwTfl0SiCiTxJCXoK1fyVVuisJN0kFlmL1_8z_iVkUGPg3cYgTUuZd2g&lib=MLQuxm21goJkl3evos7ArRqisV3GZFA2q"
          
          const _a = Boolean(await checkPaymentTransCodeExist(values.transCode))
          if (!_a) {
            let kiemtra = false;
            const checkPaid = async () => {
              try {
          
                const response = await axios.get(AppScirpt);
                const data = response.data;
                const FinalRes = data.data; 
          
                for (const BankData of FinalRes) {
                  const lastPrice = BankData["Giá trị"];  
                  const lastContent = BankData["Mô tả"];
                  const lastTransCode = BankData["Mã GD"];
          
                  if (String(lastContent).trim().includes(`${user.accountId}${user.phoneNumber}`)) {
          
                    const Payment: Payment = {
                      amount: Number(lastPrice),
                      transCode: lastTransCode,
                      userId: Number(user.userId),
                    };
                    
                    const check = await PostPayment(Payment);

                    if (check === true) kiemtra = true;
                  }
                }
              } catch (err) {
                console.error("Lỗi:", err);
              }
            };
            await checkPaid();
            if (kiemtra){
              setCheckTransCode(true);
              setIsChecked(true);
              setTimeout(() => {
                setIsChecked(false);
                setCheckTransCode(true);
              }, 3000);
            } else {
              setCheckTransCode(false);
              setIsChecked(true);
              setTimeout(() => {
                setIsChecked(false);
                setCheckTransCode(true);
              }, 3000);
            }

          } else {
          setCheckTransCode(true);
          setIsChecked(true);
          setTimeout(() => {
            setIsChecked(false);
            setCheckTransCode(true);
          }, 3000);
        }
          setLoadingButton(false);
        }

        _checkExists();
        
       },
  })
  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 100 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className='transaction'>
        <Box className='box'
          sx={{
            color: theme.color,
            backgroundColor: `rgba(${theme.rgbBackgroundColor},0.97)`,
            transition: theme.transition,
            width: '85%',
            margin: 'auto',
            borderRadius: '5px',
            marginBottom: '15px',
            minHeight: '700px'
          }}>

          <h1>Transaction History:</h1>
          <Box sx={{ width: '90%', margin: 'auto' }}>
            <Box sx={{ borderBottom: 1, borderColor: theme.color3 }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
                <Tab label={<div style={{ display: 'flex', color: theme.color2 }}><ShoppingCartIcon style={{ transform: 'translateY(-5px)' }} />Bought Artworks History</div>} {...a11yProps(0)} />
                <Tab label={<div style={{ display: 'flex', color: theme.color2 }}><AttachMoneyIcon style={{ transform: 'translateY(-5px)' }} />Sold Artworks History</div>} {...a11yProps(1)} />
                <Tab label={<div style={{ display: 'flex', color: theme.color2 }}><CurrencyExchangeIcon style={{ transform: 'translateY(-5px)' }} />Deposit Coin History</div>} {...a11yProps(2)} />
                
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <TableContainer component={Paper} style={{ marginBottom: '50px', marginTop: '40px' }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table" >
                  <TableHead>
                    <TableRow style={{ backgroundColor: '#0b81ff' }}>
                      <TableCell style={{ color: 'white' }} align="left">Artwork</TableCell>
                      <TableCell style={{ color: 'white' }} align="left">Artist</TableCell>
                      <TableCell style={{ color: 'white' }} align="left">Price</TableCell>
                      <TableCell style={{ color: 'white' }} align="left">Date</TableCell>
                      <TableCell style={{ color: 'white' }} align="left">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderByBuyer?.map((order) => (
                      <TableRow
                        key={order.orderID}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          <Typography
                            sx={{
                              fontStyle: "italic",
                              color: theme.color,
                              width: "auto",
                              ":hover": { textDecoration: "underline" },
                            }}
                            onClick={() => redirect(order.artWorkID)}
                          >
                            View
                          </Typography>
                        </TableCell>
                        {/* Seller là của người bán */}
                        <TableCell align="left">{order.sellerName}</TableCell>
                        <TableCell align="left">{order.price}</TableCell>
                        <TableCell align="left">{order.dateOfPurchase}</TableCell>
                        <TableCell align="left">
                          {order.orderID === orderHeader?.find(header => header.orderID === order.orderID).orderID && orderHeader?.find(header => header.orderID === order.orderID)?.confirmation === true ?
                            'Complete' : 'admin is processing'}
                        </TableCell>

                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={5}
                  component="div"
                  count={Order.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableContainer>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <TableContainer component={Paper} style={{ marginBottom: '50px', marginTop: '40px' }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table" >
                  <TableHead>
                    <TableRow style={{ backgroundColor: '#0b81ff' }}>
                      <TableCell style={{ color: 'white' }} align="left">Artwork</TableCell>
                      <TableCell style={{ color: 'white' }} align="left">Customer Name</TableCell>
                      <TableCell style={{ color: 'white' }} align="left">Price</TableCell>
                      <TableCell style={{ color: 'white' }} align="left">Date</TableCell>
                      <TableCell style={{ color: 'white' }} align="left">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderBySeller?.map((order) => (
                      <TableRow
                        key={order.orderID}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                         <TableCell component="th" scope="row">
                          <Typography
                            sx={{
                              fontStyle: "italic",
                              color: theme.color,
                              width: "auto",
                              ":hover": { textDecoration: "underline" },
                            }}
                            onClick={() => redirect(order.artWorkID)}
                          >
                            View
                          </Typography>
                        </TableCell>
                        {/* userNamereceiver là của người mua */}
                        <TableCell align="left">{order.buyerName}</TableCell>
                        <TableCell align="left">{order.price}</TableCell>
                        <TableCell align="left">{order.dateOfPurchase}</TableCell>
                        <TableCell align="left">
                          {order.orderID === orderHeader?.find(header => header.orderID === order.orderID).orderID && orderHeader?.find(header => header.orderID === order.orderID)?.confirmation === true ?
                            'Complete' :
                            'Admin is processing'}
                        </TableCell>

                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={5}
                  component="div"
                  count={Order.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableContainer>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <TableContainer component={Paper} style={{ marginBottom: '50px', marginTop: '40px' }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table" >
                  <TableHead>
                    <TableRow style={{ backgroundColor: '#0b81ff' }}>
                      <StyledTableCell style={{ color: 'white' }} align="left">Transaction Code</StyledTableCell>
                      <StyledTableCell style={{ color: 'white' }} align="left">Amount ($coin)</StyledTableCell>
                      <StyledTableCell style={{ color: 'white' }} align="left">Deposit Date</StyledTableCell>
                      <StyledTableCell style={{ color: 'white' }} align="left">Status</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {payments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((payment) => (
                      <StyledTableRow>
                        {/* userNamereceiver là của người mua */}
                        <StyledTableCell align="left">{payment.transCode}</StyledTableCell>
                        <StyledTableCell align="left">{payment.amount}</StyledTableCell>
                        <StyledTableCell align="left">{payment.createdAt.split("T")[0]}</StyledTableCell>
                        <StyledTableCell align="left">
                        <Chip
                          label={String(payment.status) === '1' ? 'Success' : 'Failed'}
                          color={String(payment.status) === '1' ? 'success' : 'error'}
                          variant="outlined"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
                <Box display="flex" justifyContent="space-between" alignItems="center" my={1}>
                <Box display="flex" alignItems="center" gap={1} sx={{ marginLeft: '3%' }}>
                <form onSubmit={formik.handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <TextField
                    name="transCode"
                    label="Check Transaction Code"
                    variant="outlined"
                    size="small"
                    value={formik.values.transCode}
                    onChange={formik.handleChange}
                  />

                  <Button variant="contained" color={checkTransCode ? 'success' : 'error'} type='submit'>
                    {loadingButton ? <CircularProgress size={20} sx={{ color: "white" }} /> : isChecked ? 
                    checkTransCode ? <CheckIcon /> : <CloseIcon /> : <SendIcon />}
                  </Button>
                </form>

                  {formik.errors.transCode && (
                    <Typography variant="body2" color="red" sx={{ fontSize: '12px', marginTop: '4px' }}>
                      {formik.errors.transCode}
                    </Typography>
                  )}

                </Box>

                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    component="div"
                    count={payments.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />

                  
                </Box>
              </TableContainer>
            </CustomTabPanel>
          </Box>
        </Box>
      </div>
    </>
  )
}

