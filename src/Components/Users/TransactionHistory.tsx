import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import {
  Tabs,
  Tab,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Backdrop,
  CircularProgress,
  TablePagination,
  Button,
  Chip,
  TextField,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import { Creator } from "../../Interfaces/UserInterface.ts";
import { Payment } from "../../Interfaces/PaymentIntrerfaces.ts";
import { OrderDetailsExtended, OrderHeader } from "../../Interfaces/OrderInterfaces.ts";
import { Order } from "../../share/Order.js";
import { checkPaymentTransCodeExist, getPaymentsByUserId } from "../../API/PaymentAPI/GET.tsx";
import { GetBuyerTransactions, GetSellerTransactions } from "../../API/TransactionAPI/GET.tsx";
import { GetCreatorByID } from "../../API/UserAPI/GET.tsx";
import { PostPayment } from "../../API/PaymentAPI/POST.tsx";
import "../../css/TransactionHistory.css";

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
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
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
      {...other}>
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
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

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

export default function TransactionHistory() {
  const [value, setValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [buyerTransactions, setBuyerTransactions] = useState<Transaction[]>([]);
  const [sellerTransactions, setSellerTransactions] = useState<Transaction[]>([]);
  const [transactionUsers, setTransactionUsers] = useState<{ [key: number]: Creator }>({});

  // Check payment transaction code
  const [checkTransCode, setCheckTransCode] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const savedAuth = sessionStorage.getItem("auth");
  const user = savedAuth ? JSON.parse(savedAuth) : null;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const redirect = (artID) => {
    navigate(`../artwordrecomment/artwork/${artID}`);
  };

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
  }, [user?.userId]);

  return (
    <>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 100 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="transaction">
        <Box
          className="box"
          sx={{
            color: theme.color,
            backgroundColor: `rgba(${theme.rgbBackgroundColor},0.97)`,
            transition: theme.transition,
            width: "85%",
            margin: "auto",
            borderRadius: "5px",
            marginBottom: "15px",
            minHeight: "700px",
          }}>
          <h1>Transaction History:</h1>
          <Box sx={{ width: "90%", margin: "auto" }}>
            <Box sx={{ borderBottom: 1, borderColor: theme.color3 }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
                <Tab
                  label={
                    <div style={{ display: "flex", color: theme.color2 }}>
                      <ShoppingCartIcon style={{ transform: "translateY(-5px)" }} />
                      Bought Artworks History
                    </div>
                  }
                  {...a11yProps(0)}
                />
                <Tab
                  label={
                    <div style={{ display: "flex", color: theme.color2 }}>
                      <AttachMoneyIcon style={{ transform: "translateY(-5px)" }} />
                      Sold Artworks History
                    </div>
                  }
                  {...a11yProps(1)}
                />
                <Tab
                  label={
                    <div style={{ display: "flex", color: theme.color2 }}>
                      <CurrencyExchangeIcon style={{ transform: "translateY(-5px)" }} />
                      Deposit Coin History
                    </div>
                  }
                  {...a11yProps(2)}
                />
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
              <TableContainer component={Paper} style={{ marginBottom: "50px", marginTop: "40px" }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow style={{ backgroundColor: "#0b81ff" }}>
                      <StyledTableCell style={{ color: "white" }} align="left">
                        Transaction Code
                      </StyledTableCell>
                      <StyledTableCell style={{ color: "white" }} align="left">
                        Amount (Coins)
                      </StyledTableCell>
                      <StyledTableCell style={{ color: "white" }} align="left">
                        Deposit Date
                      </StyledTableCell>
                      <StyledTableCell style={{ color: "white" }} align="left">
                        Status
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                          <Typography variant="body1" sx={{ color: theme.color }}>
                            No deposit history found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      payments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((payment) => (
                        <StyledTableRow key={payment.transCode}>
                          <StyledTableCell align="left">{payment.transCode}</StyledTableCell>
                          <StyledTableCell align="left">{payment.amount}</StyledTableCell>
                          <StyledTableCell align="left">{payment.createdAt.split("T")[0]}</StyledTableCell>
                          <StyledTableCell align="left">
                            <Chip
                              label={String(payment.status) === "1" ? "Success" : "Failed"}
                              color={String(payment.status) === "1" ? "success" : "error"}
                              variant="outlined"
                              sx={{ fontWeight: "bold" }}
                            />
                          </StyledTableCell>
                        </StyledTableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={payments.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableContainer>
            </CustomTabPanel>
          </Box>
        </Box>
      </div>
    </>
  );
}
