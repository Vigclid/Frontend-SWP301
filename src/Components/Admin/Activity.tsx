import React, { useEffect, useState } from "react";
import { Container, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import AdminNavbar from "./NavigationAd";
import { GetListActivity, GetListAllTransactions, GetListPayment } from "../../API/AdminAPI/GET.tsx";
import { GetCreatorByID } from "../../API/UserAPI/GET.tsx";
import { useNavigate } from "react-router-dom";
import moment from "moment";

interface Activity {
  ownerName: string;
  activityName: string;
  userInteract: string;
  activityDate: string;
}

interface Transaction {
  transactionID: number;
  price: number;
  buyDate: string;
  sellerID: number;
  buyerID: number;
  artworkID: number;
  sellerInfo?: any;
  buyerInfo?: any;
}

interface Payment {
  paymentId: number;
  amount: number;
  createdAt: string;
  userId: number;
  status: number;
  transCode: string;
  userInfo?: any;
}

function TabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
  const { children, value, index } = props;
  return value === index ? <>{children}</> : null;
}

export default function Activity() {
  const [value, setValue] = useState(0);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activityPage, setActivityPage] = useState(0);
  const [transactionPage, setTransactionPage] = useState(0);
  const [paymentPage, setPaymentPage] = useState(0);
  const [rowsPerPage] = useState(20);
  const navigate = useNavigate();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setActivityPage(0);
    setTransactionPage(0);
    setPaymentPage(0);
  };

  const handlePageChange = (tabIndex: number, newPage: number) => {
    switch (tabIndex) {
      case 0:
        setActivityPage(newPage);
        break;
      case 1:
        setTransactionPage(newPage);
        break;
      case 2:
        setPaymentPage(newPage);
        break;
    }
  };

  const fetchUserInfo = async (userId: number) => {
    try {
      const userInfo = await GetCreatorByID(userId.toString());
      return userInfo;
    } catch (error) {
      console.error("Error fetching user info:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const activitiesData = await GetListActivity();
        setActivities(activitiesData || []);

        const transactionsData = await GetListAllTransactions();
        const transactionsWithUsers = await Promise.all(
          transactionsData.map(async (transaction: Transaction) => {
            const sellerInfo = await fetchUserInfo(transaction.sellerID);
            const buyerInfo = await fetchUserInfo(transaction.buyerID);
            return { ...transaction, sellerInfo, buyerInfo };
          })
        );
        setTransactions(transactionsWithUsers);

        const paymentsData = await GetListPayment();
        const paymentsWithUsers = await Promise.all(
          paymentsData.map(async (payment: Payment) => {
            const userInfo = await fetchUserInfo(payment.userId);
            return { ...payment, userInfo };
          })
        );
        setPayments(paymentsWithUsers);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    console.log("fetching data", payments);

    fetchData();
  }, []);

  const handleUserClick = (accountId: number) => {
    navigate(`/characters/profile/${accountId}`);
  };

  const handleArtworkClick = (artworkId: number) => {
    navigate(`/characters/artwork/${artworkId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Container style={{ marginLeft: "300px" }}>
        <Typography variant="h4" gutterBottom style={{ fontWeight: "bold", marginTop: "40px" }}>
          Activity On ArtHub
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="List Activity" />
            <Tab label="List All Transactions" />
            <Tab label="List Payment" />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <TableContainer component={Paper} style={{ marginBottom: "50px", marginTop: "40px" }}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "#0b81ff" }}>
                  <TableCell style={{ color: "white" }}>
                    <strong>Owner</strong>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <strong>Activity</strong>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <strong>User Interact</strong>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <strong>Date</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activities
                  .slice(activityPage * rowsPerPage, activityPage * rowsPerPage + rowsPerPage)
                  .map((activity, index) => (
                    <TableRow key={index}>
                      <TableCell>{activity.ownerName}</TableCell>
                      <TableCell>{activity.activityName}</TableCell>
                      <TableCell>{activity.userInteract}</TableCell>
                      <TableCell>{moment(activity.activityDate).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5]}
              component="div"
              count={activities.length}
              rowsPerPage={rowsPerPage}
              page={activityPage}
              onPageChange={(e, newPage) => handlePageChange(0, newPage)}
            />
          </TableContainer>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <TableContainer component={Paper} style={{ marginBottom: "50px", marginTop: "40px" }}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "#0b81ff" }}>
                  <TableCell style={{ color: "white" }}>
                    <strong>Transaction ID</strong>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <strong>Seller</strong>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <strong>Buyer</strong>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <strong>Artwork ID</strong>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <strong>Price</strong>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <strong>Date</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions
                  .slice(transactionPage * rowsPerPage, transactionPage * rowsPerPage + rowsPerPage)
                  .map((transaction) => (
                    <TableRow key={transaction.transactionID}>
                      <TableCell>{transaction.transactionID}</TableCell>
                      <TableCell>
                        <Box
                          onClick={() => handleUserClick(transaction.sellerInfo?.accountId)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            cursor: "pointer",
                            "&:hover": { textDecoration: "underline" },
                          }}>
                          <Avatar src={transaction.sellerInfo?.profilePicture} />
                          {transaction.sellerInfo?.firstName} {transaction.sellerInfo?.lastName}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          onClick={() => handleUserClick(transaction.buyerInfo?.accountId)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            cursor: "pointer",
                            "&:hover": { textDecoration: "underline" },
                          }}>
                          <Avatar src={transaction.buyerInfo?.profilePicture} />
                          {transaction.buyerInfo?.firstName} {transaction.buyerInfo?.lastName}
                        </Box>
                      </TableCell>
                      <TableCell
                        onClick={() => handleArtworkClick(transaction.artworkID)}
                        sx={{
                          cursor: "pointer",
                          "&:hover": { textDecoration: "underline" },
                        }}>
                        {transaction.artworkID}
                      </TableCell>
                      <TableCell>${transaction.price}</TableCell>
                      <TableCell>{moment(transaction.buyDate).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5]}
              component="div"
              count={transactions.length}
              rowsPerPage={rowsPerPage}
              page={transactionPage}
              onPageChange={(e, newPage) => handlePageChange(1, newPage)}
            />
          </TableContainer>
        </TabPanel>

        <TabPanel value={value} index={2}>
          <TableContainer component={Paper} style={{ marginBottom: "50px", marginTop: "40px" }}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "#0b81ff" }}>
                  <TableCell style={{ color: "white" }}>
                    <strong>Payment ID</strong>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <strong>User</strong>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <strong>Amount</strong>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <strong>Status</strong>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <strong>Transaction Code</strong>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <strong>Created At</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.slice(paymentPage * rowsPerPage, paymentPage * rowsPerPage + rowsPerPage).map((payment) => (
                  <TableRow key={payment.paymentId}>
                    <TableCell>{payment.paymentId}</TableCell>
                    <TableCell>
                      <Box
                        onClick={() => handleUserClick(payment.userInfo?.accountId)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          cursor: "pointer",
                          "&:hover": { textDecoration: "underline" },
                        }}>
                        <Avatar src={payment.userInfo?.profilePicture} />
                        {payment.userInfo?.firstName} {payment.userInfo?.lastName}
                      </Box>
                    </TableCell>
                    <TableCell>${payment.amount}</TableCell>
                    <TableCell>
                      <Typography color={payment.status === 1 ? "success.main" : "warning.main"}>
                        {payment.status === 1 ? "Success" : "Pending"}
                      </Typography>
                    </TableCell>
                    <TableCell>{payment.transCode}</TableCell>
                    <TableCell>{moment(payment.createdAt).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5]}
              component="div"
              count={payments.length}
              rowsPerPage={rowsPerPage}
              page={paymentPage}
              onPageChange={(e, newPage) => handlePageChange(2, newPage)}
            />
          </TableContainer>
        </TabPanel>
      </Container>
    </>
  );
}
