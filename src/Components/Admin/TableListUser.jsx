import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Paper,
  Avatar,
  CircularProgress,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useNavigate } from "react-router-dom";
import { GetListUser } from "../../API/AdminAPI/GET.tsx";
import { LockAccount, UnlockAccount } from "../../API/AdminAPI/PUT.tsx";
import { GetCreatorByAccountID } from "../../API/UserAPI/GET.tsx";

export default function TableListUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const navigate = useNavigate();

  const fetchUsersWithInfo = async () => {
    setLoading(true);
    try {
      const userList = await GetListUser();
      const usersWithAvatars = await Promise.all(
        userList.map(async (user) => {
          try {
            const userInfo = await GetCreatorByAccountID(user.accountID.toString());
            return {
              ...user,
              profilePicture: userInfo?.profilePicture,
            };
          } catch (error) {
            console.error(`Error fetching avatar for user ${user.accountID}:`, error);
            return user;
          }
        })
      );
      setUsers(usersWithAvatars);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersWithInfo();
  }, []);

  const handleUserClick = (accountId) => {
    navigate(`/characters/profile/${accountId}`);
  };

  const showConfirmDialog = (action, params) => {
    setConfirmAction({ action, params });
    setDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    try {
      if (confirmAction.action === "lock") {
        await LockAccount(confirmAction.params.accountId);
      } else {
        await UnlockAccount(confirmAction.params.accountId);
      }
      await fetchUsersWithInfo();
    } catch (error) {
      console.error(`Error performing ${confirmAction.action}:`, error);
    }
    setDialogOpen(false);
    setConfirmAction(null);
  };

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
        Users Management
      </Typography>

      <TableContainer
        component={Paper}
        style={{
          marginBottom: "50px",
          marginTop: "40px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#0b81ff" }}>
              <TableCell style={{ color: "white" }}>
                <strong>ID</strong>
              </TableCell>
              <TableCell style={{ color: "white" }}>
                <strong>User Name</strong>
              </TableCell>
              <TableCell style={{ color: "white" }}>
                <strong>Email</strong>
              </TableCell>
              <TableCell style={{ color: "white" }}>
                <strong>Phone Number</strong>
              </TableCell>
              <TableCell style={{ color: "white" }}>
                <strong>Rank</strong>
              </TableCell>
              <TableCell style={{ color: "white" }}>
                <strong>Behavior</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.accountID}>
                <TableCell>{user.accountID}</TableCell>
                <TableCell>
                  <Box
                    onClick={() => handleUserClick(user.accountID)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}>
                    <Avatar src={user.profilePicture} />
                    {user.userName}
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNumber || "N/A"}</TableCell>
                <TableCell>{user.nameOfRank}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {user.status === 1 ? (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => showConfirmDialog("lock", { accountId: user.accountID })}>
                        Lock Account
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => showConfirmDialog("unlock", { accountId: user.accountID })}>
                        Unlock Account
                      </Button>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to{" "}
            {confirmAction?.action === "lock" ? (
              <strong>lock this user's account</strong>
            ) : (
              <strong>unlock this user's account</strong>
            )}
            ?
          </Typography>
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
