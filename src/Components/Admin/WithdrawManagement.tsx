import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Creator } from "../../Interfaces/UserInterface";
import {
  Box,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { GetListWithdrawInProgress, GetListWithdrawBeAccept } from "../../API/AdminAPI/GET.tsx";
import { AcceptWithdraw } from "../../API/AdminAPI/PUT.tsx";
import { GetCreatorByID } from "../../API/UserAPI/GET.tsx";
import { format } from "date-fns";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface WithdrawItem {
  withdrawID: number;
  coinWithdraw: number;
  dateRequest: string;
  userID: number;
  bankNumber: string;
  bankName: string;
  status: number;
  user?: Creator;
}

export default function WithdrawManagement() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  const handleUserClick = (accountId: number | "0") => {
    navigate(`/characters/profile/${accountId}`);
  };
  const [pendingWithdraws, setPendingWithdraws] = useState<WithdrawItem[]>([]);
  const [finishedWithdraws, setFinishedWithdraws] = useState<WithdrawItem[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedWithdraw, setSelectedWithdraw] = useState<WithdrawItem | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currencyMenuAnchor, setCurrencyMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<"USD" | "VND">("USD");

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleConfirmOpen = (withdraw: WithdrawItem) => {
    setSelectedWithdraw(withdraw);
    setConfirmDialogOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmDialogOpen(false);
  };

  const handleAcceptWithdraw = async () => {
    if (selectedWithdraw) {
      try {
        await AcceptWithdraw(selectedWithdraw.withdrawID);
        // Refresh the lists
        fetchWithdraws();
        handleConfirmClose();
      } catch (error) {
        console.error("Error accepting withdraw:", error);
      }
    }
  };

  const handleCurrencyClick = (event: React.MouseEvent<HTMLElement>) => {
    setCurrencyMenuAnchor(event.currentTarget);
  };

  const handleCurrencySelect = (currency: "USD" | "VND") => {
    setSelectedCurrency(currency);
    setCurrencyMenuAnchor(null);
  };

  const calculateNeedPay = (coinWithdraw: number, currency: "USD" | "VND"): string => {
    if (currency === "VND") {
      return `${(coinWithdraw * 24815).toLocaleString()} VND`; // Example exchange rate
    }
    return `$${coinWithdraw.toFixed(2)}`;
  };

  const sortByDate = (a: WithdrawItem, b: WithdrawItem) => {
    const dateA = new Date(a.dateRequest).getTime();
    const dateB = new Date(b.dateRequest).getTime();
    return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
  };

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const fetchWithdraws = async () => {
    try {
      const [pendingData, finishedData] = await Promise.all([GetListWithdrawInProgress(), GetListWithdrawBeAccept()]);

      const processWithdraws = async (withdraws: WithdrawItem[]) => {
        return await Promise.all(
          withdraws.map(async (withdraw) => {
            const userInfo = await GetCreatorByID(withdraw.userID.toString());
            return { ...withdraw, user: userInfo };
          })
        );
      };

      const pendingWithUsers = await processWithdraws(pendingData);
      const finishedWithUsers = await processWithdraws(finishedData);

      setPendingWithdraws(pendingWithUsers);
      setFinishedWithdraws(finishedWithUsers);
    } catch (error) {
      console.error("Error fetching withdraws:", error);
    }
  };

  useEffect(() => {
    fetchWithdraws();
  }, []);

  const renderWithdrawTable = (withdraws: WithdrawItem[]) => (
    <TableContainer component={Paper} style={{ marginBottom: "50px", marginTop: "40px" }}>
      <Table>
        <TableHead>
          <TableRow style={{ backgroundColor: "#0b81ff" }}>
            <TableCell style={{ color: "white" }}>
              <strong>Withdraw ID</strong>
            </TableCell>
            <TableCell style={{ color: "white" }}>
              <strong>User</strong>
            </TableCell>
            <TableCell onClick={toggleSortDirection} style={{ cursor: "pointer", color: "white" }}>
              <strong>Create Date {sortDirection === "asc" ? "↑" : "↓"}</strong>
            </TableCell>
            <TableCell style={{ color: "white" }}>
              <strong>Bank Name</strong>
            </TableCell>
            <TableCell style={{ color: "white" }}>
              <strong>Bank Number</strong>
            </TableCell>
            <TableCell style={{ color: "white" }}>
              <strong>Coin</strong>
            </TableCell>
            <TableCell onClick={handleCurrencyClick} style={{ cursor: "pointer", color: "white" }}>
              <strong>Need Pay ({selectedCurrency})</strong>
            </TableCell>
            <TableCell style={{ color: "white" }}>
              <strong>Status</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[...withdraws].sort(sortByDate).map((withdraw) => (
            <TableRow key={withdraw.withdrawID}>
              <TableCell>{withdraw.withdrawID}</TableCell>
              <TableCell>
                <Box
                  onClick={() => withdraw.user?.accountId && handleUserClick(withdraw.user.accountId)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}>
                  <Avatar src={withdraw.user?.profilePicture} />
                  <Typography>
                    {withdraw.user?.firstName} {withdraw.user?.lastName}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>{format(new Date(withdraw.dateRequest), "MM/dd/yyyy HH:mm")}</TableCell>
              <TableCell>{withdraw.bankName}</TableCell>
              <TableCell>{withdraw.bankNumber}</TableCell>
              <TableCell>${withdraw.coinWithdraw}</TableCell>
              <TableCell>{calculateNeedPay(withdraw.coinWithdraw, selectedCurrency)}</TableCell>
              <TableCell>
                {withdraw.status === 0 ? (
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={() => handleConfirmOpen(withdraw)}
                    sx={{
                      width: "100%",
                      "&:hover": {
                        backgroundColor: "warning.light",
                      },
                    }}>
                    Pending
                  </Button>
                ) : (
                  <Box
                    sx={{
                      bgcolor: "success.light",
                      color: "success.dark",
                      p: 1,
                      borderRadius: 1,
                      textAlign: "center",
                      fontWeight: "bold",
                      boxShadow: 1,
                    }}>
                    Processed
                  </Box>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ marginLeft: "300px" }}>
      <Typography variant="h4" gutterBottom style={{ fontWeight: "bold", marginTop: "40px" }}>
        Withdraw Management
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Pending Withdrawal Form" />
          <Tab label="Finished Withdrawal Form" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {renderWithdrawTable(pendingWithdraws)}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {renderWithdrawTable(finishedWithdraws)}
      </TabPanel>

      <Dialog open={confirmDialogOpen} onClose={handleConfirmClose}>
        <DialogTitle>Confirm Withdraw</DialogTitle>
        <DialogContent>Are You Sure Want To Finish Withdraw?</DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose}>Cancel</Button>
          <Button onClick={handleAcceptWithdraw} variant="contained" color="primary">
            Accept
          </Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={currencyMenuAnchor}
        open={Boolean(currencyMenuAnchor)}
        onClose={() => setCurrencyMenuAnchor(null)}>
        <MenuItem onClick={() => handleCurrencySelect("USD")}>USD</MenuItem>
        <MenuItem onClick={() => handleCurrencySelect("VND")}>VND</MenuItem>
      </Menu>
    </Box>
  );
}
