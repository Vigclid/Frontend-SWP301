
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
import { GetBuyerTransactions, GetSellerTransactions } from "../../API/TransactionAPI/GET.tsx";
import { GetCreatorByID } from '../../API/UserAPI/GET.tsx';
// MUI Tab
interface Transaction {
  transactionID: number;
  price: number;
  buyDate: string;
  sellerID: number;
  buyerID: number;
  artworkID: number;
}
interface TransactionTableProps {
  transactions: Transaction[];
  users: { [key: number]: Creator };
  onRedirect: (artworkId: number) => void;
  page: number;
  rowsPerPage: number;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  theme: any;
}

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


  const [buyerTransactions, setBuyerTransactions] = useState<Transaction[]>([]);
  const [sellerTransactions, setSellerTransactions] = useState<Transaction[]>([]);
  const [transactionUsers, setTransactionUsers] = useState<{ [key: number]: Creator }>({});


  const [payments, setPayments] = useState<Payment[]>([])
  //Handle button in deposit coin history
  const [checkTransCode,setCheckTransCode] = useState<Boolean>(true);
  const [loadingButton, setLoadingButton] = useState<Boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);



  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!user?.userId) {
          console.error("User not logged in");
          return;
        }

        // Fetch payments
        const paymentsByUserId = await getPaymentsByUserId(user.userId.toString());
        if (!paymentsByUserId) {
          throw new Error("Failed to fetch payments");
        }
        setPayments(paymentsByUserId);

        // Fetch transactions
        const [buyerData, sellerData] = await Promise.all([
          GetBuyerTransactions(user.userId),
          GetSellerTransactions(user.userId),
        ]);

        if (!buyerData || !sellerData) {
          throw new Error("Failed to fetch transactions");
        }

        setBuyerTransactions(buyerData);
        setSellerTransactions(sellerData);

        // Fetch user details for all transactions
        const userIds = new Set([
          ...buyerData.map((t) => t.buyerID),
          ...buyerData.map((t) => t.sellerID),
          ...sellerData.map((t) => t.buyerID),
          ...sellerData.map((t) => t.sellerID),
        ]);

        const userPromises = Array.from(userIds).map((id) => GetCreatorByID(id.toString()));
        const users = await Promise.all(userPromises);

        const userMap = {};
        users.forEach((user, index) => {
          if (user) {
            userMap[Array.from(userIds)[index]] = user;
          }
        });

        setTransactionUsers(userMap);
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [user?.userId])

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
          const AppScirpt = "https://script.google.com/macros/s/AKfycbznOS8HW3m9CjNjcMGcG28PvSt8b4acEK15pku5HAfYyt7p0v5ZYr6i5IVIRm1tzgH2/exec"
          
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



  const BoughtTransactionsTable: React.FC<TransactionTableProps> = ({
    transactions,
    users,
    onRedirect,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    theme,
  }) => (
    <TableContainer component={Paper} style={{ marginBottom: "50px", marginTop: "40px" }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow style={{ backgroundColor: "#0b81ff" }}>
            <StyledTableCell style={{ color: "white" }} align="left">
              Buyer
            </StyledTableCell>
            <StyledTableCell style={{ color: "white" }} align="left">
              Seller
            </StyledTableCell>
            <StyledTableCell style={{ color: "white" }} align="left">
              Date
            </StyledTableCell>
            <StyledTableCell style={{ color: "white" }} align="left">
              Price
            </StyledTableCell>
            <StyledTableCell style={{ color: "white" }} align="left">
              Artwork
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                <Typography variant="body1" sx={{ color: theme.color }}>
                  No purchased artworks found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((transaction) => (
              <StyledTableRow key={transaction.transactionID}>
                <StyledTableCell align="left">
                  {users[transaction.buyerID]?.firstName} {users[transaction.buyerID]?.lastName}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {users[transaction.sellerID]?.firstName} {users[transaction.sellerID]?.lastName}
                </StyledTableCell>
                <StyledTableCell align="left">{transaction.buyDate.split("T")[0]}</StyledTableCell>
                <StyledTableCell align="left">{transaction.price} Coins</StyledTableCell>
                <StyledTableCell align="left">
                  <Typography
                    sx={{
                      fontStyle: "italic",
                      color: theme.color,
                      width: "auto",
                      cursor: "pointer",
                      ":hover": { textDecoration: "underline" },
                    }}
                    onClick={() => onRedirect(transaction.artworkID)}>
                    View
                  </Typography>
                </StyledTableCell>
              </StyledTableRow>
            ))
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={transactions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
  
  const SoldTransactionsTable: React.FC<TransactionTableProps> = ({
    transactions,
    users,
    onRedirect,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    theme,
  }) => (
    <TableContainer component={Paper} style={{ marginBottom: "50px", marginTop: "40px" }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow style={{ backgroundColor: "#0b81ff" }}>
            <StyledTableCell style={{ color: "white" }} align="left">
              Seller
            </StyledTableCell>
            <StyledTableCell style={{ color: "white" }} align="left">
              Buyer
            </StyledTableCell>
            <StyledTableCell style={{ color: "white" }} align="left">
              Date
            </StyledTableCell>
            <StyledTableCell style={{ color: "white" }} align="left">
              Price
            </StyledTableCell>
            <StyledTableCell style={{ color: "white" }} align="left">
              Artwork
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                <Typography variant="body1" sx={{ color: theme.color }}>
                  No sold artworks found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((transaction) => (
              <StyledTableRow key={transaction.transactionID}>
                <StyledTableCell align="left">
                  {users[transaction.sellerID]?.firstName} {users[transaction.sellerID]?.lastName}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {users[transaction.buyerID]?.firstName} {users[transaction.buyerID]?.lastName}
                </StyledTableCell>
                <StyledTableCell align="left">{transaction.buyDate.split("T")[0]}</StyledTableCell>
                <StyledTableCell align="left">{transaction.price} Coins</StyledTableCell>
                <StyledTableCell align="left">
                  <Typography
                    sx={{
                      fontStyle: "italic",
                      color: theme.color,
                      width: "auto",
                      cursor: "pointer",
                      ":hover": { textDecoration: "underline" },
                    }}
                    onClick={() => onRedirect(transaction.artworkID)}>
                    View
                  </Typography>
                </StyledTableCell>
              </StyledTableRow>
            ))
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={transactions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );

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
              <BoughtTransactionsTable
                  transactions={buyerTransactions}
                  users={transactionUsers}
                  onRedirect={redirect}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  handleChangePage={handleChangePage}
                  handleChangeRowsPerPage={handleChangeRowsPerPage}
                  theme={theme}
                />

            </CustomTabPanel>

            <CustomTabPanel value={value} index={1}>
              <SoldTransactionsTable
                transactions={sellerTransactions}
                users={transactionUsers}
                onRedirect={redirect}
                page={page}
                rowsPerPage={rowsPerPage}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                theme={theme}
              />
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
                  {
                    payments && payments.length > 0 ? (
                      payments
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((payment, index) => (
                          <StyledTableRow key={index}>
                            {/* userNamereceiver là của người mua */}
                            <StyledTableCell align="left">{payment.transCode}</StyledTableCell>
                            <StyledTableCell align="left">{payment.amount}</StyledTableCell>
                            <StyledTableCell align="left">{payment.createdAt.split("+")[0]}</StyledTableCell>
                            <StyledTableCell align="left">
                              <Chip
                                label={String(payment.status) === '1' ? 'Success' : 'Failed'}
                                color={String(payment.status) === '1' ? 'success' : 'error'}
                                variant="outlined"
                                sx={{ fontWeight: 'bold' }}
                              />
                            </StyledTableCell>
                          </StyledTableRow>
                        ))
                    ) : (
                      <StyledTableRow>
                        <StyledTableCell align="center" colSpan={4}>
                          Không có giao dịch nào
                        </StyledTableCell>
                      </StyledTableRow>
                    )
                  }
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
                    count={payments ? payments.length : 0}
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

