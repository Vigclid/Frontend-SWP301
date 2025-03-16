import * as React from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Snackbar, Alert } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import ListItemButton from "@mui/material/ListItemButton";
import LogoutIcon from "@mui/icons-material/Logout";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Link } from "react-router-dom";
import { generateAdminReport } from "./ExportPDF.tsx";
import { useAuth } from "../AuthenContext.tsx";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
function AdminNavbar() {
  // The side drawer width
  const drawerWidth = 220;
  // Sidebar navigation list
  // const adminNavItems = [
  //   { text: 'Dashboard', icon: <HomeIcon /> , link: '/' },
  //   { text: 'Users', icon: <PeopleIcon />, },
  //   { text: 'Reports', icon: <BarChartIcon /> },
  // Add more navigation items here
  // ];
  const { logout } = useAuth();
  const [exporting, setExporting] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await generateAdminReport();
      setSnackbar({
        open: true,
        message: "Report opened in new window. Please allow popups if you don't see it.",
        severity: "success",
      });
    } catch (error) {
      console.error("Error generating report:", error);
      if (error.message?.includes("popup")) {
        setSnackbar({
          open: true,
          message: "Please allow popups to generate the report",
          severity: "warning",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Failed to generate report",
          severity: "error",
        });
      }
    } finally {
      setExporting(false);
    }
  };
  return (
    <div style={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        anchor="left"
        style={{
          width: drawerWidth,
        }}
        open>
        <div
          style={{
            backgroundColor: "#121621",
            paddingTop: "50px",
            paddingBottom: "20px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}>
          <img src="/sliderImages/icon_demo.png" alt="Logo" style={{ width: "120px" }} />
        </div>
        <List style={{ backgroundColor: "#121621", height: "100%", color: "#fdfdff" }}>
          {/* Dashboard */}
          <Link to={`/admin`}>
            <ListItemButton button style={{ width: "220px", marginLeft: "10px" }}>
              <ListItemIcon>
                <HomeIcon style={{ color: "#fdfdff" }} />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </Link>

          {/* Users */}
          <Link to={`listuser`}>
            <ListItemButton button style={{ width: "220px", marginLeft: "10px" }}>
              <ListItemIcon>
                <PeopleIcon style={{ color: "#fdfdff" }} />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItemButton>
          </Link>

          {/* Reports */}
          <Link to={"report"}>
            <ListItemButton button style={{ width: "220px", marginLeft: "10px" }}>
              <ListItemIcon>
                <ErrorOutlineIcon style={{ color: "#fdfdff" }} />
              </ListItemIcon>
              <ListItemText primary="Reports" />
            </ListItemButton>
          </Link>
          {/* ManageOrders */}
          <Link to={"manageorders"}>
            <ListItemButton button style={{ width: "220px", marginLeft: "10px" }}>
              <ListItemIcon>
                <ManageAccountsIcon style={{ color: "#fdfdff" }} />
              </ListItemIcon>
              <ListItemText primary="Manage Orders" />
            </ListItemButton>
          </Link>

          {/* Activity On ArtHub */}
          <Link to={"activity"}>
            <ListItemButton button style={{ width: "220px", marginLeft: "10px" }}>
              <ListItemIcon>
                <BarChartIcon style={{ color: "#fdfdff" }} />
              </ListItemIcon>
              <ListItemText primary="Activity On ArtHub" />
            </ListItemButton>
          </Link>
          <Link to={"request-upgrade"}>
            <ListItemButton button style={{ width: "220px", marginLeft: "10px" }}>
              <ListItemIcon>
                <AutoAwesomeIcon style={{ color: "#fdfdff" }} />
              </ListItemIcon>
              <ListItemText primary="Request To Upgrade" />
            </ListItemButton>
          </Link>

          {/* Export Report */}
          <ListItemButton
            button
            style={{ width: "220px", marginLeft: "10px" }}
            onClick={handleExport}
            disabled={exporting}>
            <ListItemIcon>
              <FileDownloadIcon style={{ color: "#fdfdff" }} />
            </ListItemIcon>
            <ListItemText primary={exporting ? "Generating..." : "Export Report"} />
          </ListItemButton>

          {/* Log out */}
          <ListItemButton button style={{ width: "220px", marginLeft: "10px" }} onClick={logout}>
            <ListItemIcon>
              <LogoutIcon style={{ color: "#fdfdff" }} />
            </ListItemIcon>
            <ListItemText primary="Log out" />
          </ListItemButton>
        </List>
      </Drawer>
      <div style={{ flexGrow: 1, padding: 3 }}>{/* Main content will go here */}</div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
export default AdminNavbar;
