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
import { GetListArtistForm } from "../../API/AdminAPI/GET.tsx";
import { AcceptToUpgrade } from "../../API/AdminAPI/PUT.tsx";
import { GetCreatorByID } from "../../API/UserAPI/GET.tsx";
import { RefuseToUpgrade } from "../../API/AdminAPI/DELETE.tsx";
import moment from "moment";

interface ArtistForm {
  formId: number;
  descriptions: string;
  status: number;
  dateCreation: string;
  userId: number;
  rankID: number;
  userInfo?: {
    profilePicture: string;
    firstName: string;
    lastName: string;
  };
}

export default function RequestToUpgrade() {
  const [forms, setForms] = useState<ArtistForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmAction, setConfirmAction] = useState<{
    action: "accept" | "refuse";
    form: ArtistForm;
  } | null>(null);
  const [descriptionDialog, setDescriptionDialog] = useState<{
    open: boolean;
    description: string;
  }>({ open: false, description: "" });
  const navigate = useNavigate();

  const fetchFormsWithUserInfo = async () => {
    setLoading(true);
    try {
      const formList = await GetListArtistForm();
      const formsWithUsers = await Promise.all(
        formList.map(async (form) => {
          try {
            const userInfo = await GetCreatorByID(form.userId.toString());
            return { ...form, userInfo };
          } catch (error) {
            console.error(`Error fetching user info for form ${form.formId}:`, error);
            return form;
          }
        })
      );
      setForms(formsWithUsers);
    } catch (error) {
      console.error("Error fetching forms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormsWithUserInfo();
  }, []);

  const handleUserClick = (accountId: number) => {
    navigate(`/characters/profile/${accountId}`);
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    try {
      if (confirmAction.action === "accept") {
        await AcceptToUpgrade({
          formId: confirmAction.form.formId,
          descriptions: confirmAction.form.descriptions,
          status: 0,
          dateCreation: moment().format("YYYY-MM-DDTHH:mm:ss.SSS") + "+07:00",
          userId: confirmAction.form.userId,
          rankID: confirmAction.form.rankID,
        });
      } else {
        await RefuseToUpgrade(confirmAction.form.formId);
      }
      await fetchFormsWithUserInfo();
    } catch (error) {
      console.error(`Error performing ${confirmAction.action}:`, error);
    }
    setConfirmAction(null);
  };

  const handleViewDescription = (description: string) => {
    setDescriptionDialog({ open: true, description });
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
        Artist Upgrade Requests
      </Typography>

      <TableContainer component={Paper} style={{ marginBottom: "50px", marginTop: "40px" }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#0b81ff" }}>
              <TableCell style={{ color: "white" }}>
                <strong>Form ID</strong>
              </TableCell>
              <TableCell style={{ color: "white" }}>
                <strong>User Name</strong>
              </TableCell>
              <TableCell style={{ color: "white" }}>
                <strong>Date Create</strong>
              </TableCell>
              <TableCell style={{ color: "white" }}>
                <strong>Description</strong>
              </TableCell>
              <TableCell style={{ color: "white" }}>
                <strong>Status</strong>
              </TableCell>
              <TableCell style={{ color: "white" }}>
                <strong>Behavior</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {forms.map((form) => (
              <TableRow key={form.formId}>
                <TableCell>{form.formId}</TableCell>
                <TableCell>
                  <Box
                    onClick={() => handleUserClick(form.userId)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}>
                    <Avatar src={form.userInfo?.profilePicture} />
                    {form.userInfo?.firstName && form.userInfo?.lastName
                      ? `${form.userInfo.firstName} ${form.userInfo.lastName}`
                      : "Unknown User"}
                  </Box>
                </TableCell>
                <TableCell>{moment(form.dateCreation).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
                <TableCell>
                  <Button variant="outlined" size="small" onClick={() => handleViewDescription(form.descriptions)}>
                    View Description
                  </Button>
                </TableCell>
                <TableCell>
                  {form.status === 0 ? (
                    <Typography color="warning.main">Pending</Typography>
                  ) : (
                    <Typography color="success.main">Processed</Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => setConfirmAction({ action: "accept", form })}>
                      Accept To Upgrade
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => setConfirmAction({ action: "refuse", form })}>
                      Refuse To Upgrade
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Action Confirmation Dialog */}
      <Dialog open={!!confirmAction} onClose={() => setConfirmAction(null)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {confirmAction?.action === "accept" ? "accept" : "refuse"} this upgrade request?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmAction(null)}>Cancel</Button>
          <Button onClick={handleConfirmAction} variant="contained" color="primary">
            Accept
          </Button>
        </DialogActions>
      </Dialog>

      {/* Description Dialog */}
      <Dialog open={descriptionDialog.open} onClose={() => setDescriptionDialog({ open: false, description: "" })}>
        <DialogTitle>Description</DialogTitle>
        <DialogContent>
          <Typography>{descriptionDialog.description}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDescriptionDialog({ open: false, description: "" })} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
