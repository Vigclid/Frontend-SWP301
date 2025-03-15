import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Tab,
  Tabs,
  Paper,
  CircularProgress,
  Avatar,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { GetListReportsUnfinished, GetListReportsFinished } from "../../API/AdminAPI/GET.tsx";
import { LockAccount, UnlockAccount, UpdateReportStatus } from "../../API/AdminAPI/PUT.tsx";
import { DeleteArtwork } from "../../API/AdminAPI/DELETE.tsx";
import { GetCreatorByID } from "../../API/UserAPI/GET.tsx";

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} role="tabpanel" id={`report-tabpanel-${index}`}>
      {value === index && children}
    </div>
  );
}

export default function Report() {
  const [unfinishedReports, setUnfinishedReports] = useState([]);
  const [finishedReports, setFinishedReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const navigate = useNavigate();

  const fetchReportsWithUserInfo = async () => {
    setLoading(true);
    try {
      const [unfinishedData, finishedData] = await Promise.all([GetListReportsUnfinished(), GetListReportsFinished()]);

      const processReports = async (reports) => {
        return await Promise.all(
          reports.map(async (report) => {
            const reporter = await GetCreatorByID(report.reporterId.toString());
            const reported = await GetCreatorByID(report.reportedId.toString());
            return { ...report, reporterInfo: reporter, reportedInfo: reported };
          })
        );
      };

      const unfinishedWithUsers = await processReports(unfinishedData);
      const finishedWithUsers = await processReports(finishedData);

      setUnfinishedReports(unfinishedWithUsers);
      setFinishedReports(finishedWithUsers);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsWithUserInfo();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleUserClick = (accountId) => {
    navigate(`/characters/profile/${accountId}`);
  };

  const handleArtworkClick = (artworkId) => {
    navigate(`/characters/artwork/${artworkId}`);
  };

  const showConfirmDialog = (action, params) => {
    setConfirmAction({ action, params });
    setDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    try {
      switch (confirmAction.action) {
        case "lock":
          await LockAccount(confirmAction.params.accountId);
          break;
        case "unlock":
          await UnlockAccount(confirmAction.params.accountId);
          break;
        case "delete":
          await DeleteArtwork(confirmAction.params.artworkId);
          break;
        case "complete":
          await UpdateReportStatus(confirmAction.params.reportId);
          break;
      }
      await fetchReportsWithUserInfo();
    } catch (error) {
      console.error(`Error performing ${confirmAction.action}:`, error);
    }
    setDialogOpen(false);
    setConfirmAction(null);
  };

  const renderReportTable = (reports) => (
    <TableContainer component={Paper} style={{ marginBottom: "50px", marginTop: "40px" }}>
      <Table>
        <TableHead>
          <TableRow style={{ backgroundColor: "#0b81ff" }}>
            <TableCell style={{ color: "white" }}>
              <strong>Reporter</strong>
            </TableCell>
            <TableCell style={{ color: "white" }}>
              <strong>Reported</strong>
            </TableCell>
            <TableCell style={{ color: "white" }}>
              <strong>Artwork</strong>
            </TableCell>
            <TableCell style={{ color: "white" }}>
              <strong>Create Date</strong>
            </TableCell>
            <TableCell style={{ color: "white" }}>
              <strong>Description</strong>
            </TableCell>
            <TableCell style={{ color: "white" }}>
              <strong>Behavior</strong>
            </TableCell>
            <TableCell style={{ color: "white" }}>
              <strong>Status</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.reportId}>
              <TableCell>
                <Box
                  onClick={() => handleUserClick(report.reporterInfo?.accountId)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}>
                  <Avatar src={report.reporterInfo?.profilePicture} />
                  {report.reporterInfo?.firstName} {report.reporterInfo?.lastName}
                </Box>
              </TableCell>
              <TableCell>
                <Box
                  onClick={() => handleUserClick(report.reportedInfo?.accountId)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}>
                  <Avatar src={report.reportedInfo?.profilePicture} />
                  {report.reportedInfo?.firstName} {report.reportedInfo?.lastName}
                </Box>
              </TableCell>
              <TableCell>
                {report.artworkId !== 0 && (
                  <Typography
                    onClick={() => handleArtworkClick(report.artworkId)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}>
                    {report.artworkId}
                  </Typography>
                )}
              </TableCell>
              <TableCell>{moment(report.createdDate).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
              <TableCell>{report.description}</TableCell>
              <TableCell>
                <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
                  {report.statusUser === 1 && (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => showConfirmDialog("lock", { accountId: report.reportedInfo?.accountId })}>
                      Lock Account
                    </Button>
                  )}
                  {report.statusUser === 0 && (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => showConfirmDialog("unlock", { accountId: report.reportedInfo?.accountId })}>
                      Unlock Account
                    </Button>
                  )}
                  {report.artworkId !== 0 && (
                    <Button
                      variant="contained"
                      onClick={() => showConfirmDialog("delete", { artworkId: report.artworkId })}>
                      Delete Artwork
                    </Button>
                  )}
                </Box>
              </TableCell>
              <TableCell>
                {report.status === 0 ? (
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={() => showConfirmDialog("complete", { reportId: report.reportId })}
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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container style={{ marginLeft: "300px" }}>
      <Typography variant="h4" gutterBottom style={{ fontWeight: "bold", marginTop: "40px" }}>
        Reports Management
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Unfinished Reports" />
          <Tab label="Finished Reports" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {renderReportTable(unfinishedReports)}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {renderReportTable(finishedReports)}
      </TabPanel>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          Are you sure you want to{" "}
          {confirmAction?.action === "complete"
            ? "complete this report"
            : confirmAction?.action === "lock"
            ? "lock this account"
            : confirmAction?.action === "unlock"
            ? "unlock this account"
            : "delete this artwork"}
          ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmAction} variant="contained" color="primary">
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
