import React, { useContext, useEffect , useState} from "react";
import { Box, Card, CardMedia, Typography, Button } from "@mui/material";
import { ThemeContext } from '../Themes/ThemeProvider.tsx';
import '../../css/PaymentArea.css'
import { Creator } from "../../Interfaces/UserInterface.ts";

const MY_BANK = {

  BANK_ID : "970422", //MB Bank
  ACCOUNT_NO : "0356759177",
  TEMPLATE: "qr_only",
  ACCOUNT_NAME: "Doan Xuan Son"
}

// Attempt to retrieve the auth state from sessionStorage
const savedAuth = sessionStorage.getItem("auth");
// Check if there's any auth data saved and parse it
const userInSession: Creator = savedAuth ? JSON.parse(savedAuth) : "";
// Now 'auth' contains your authentication state or null if there's nothing saved
const AppScirpt = "https://script.googleusercontent.com/macros/echo?user_content_key=D6c0jQidt"+
                  "1bx4NhUcDgA4r3recUdqzgqGD1u3uyxsT8e7Y6LtGZafr5faoJclVP6FEwAr3z3wA1havuu9kJX"+
                  "JfI5qIz7MNlvm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnDzsAlD6ug9F"+
                  "sXOxdoyN-BO226sy0AJl2UoKLOqjRp3h9KpIYTSbk9vet7j5ea-Rg4Ol3lRZLwCEBiCs-ictM-yoB"+
                  "Fes96d7Hg&lib=MLQuxm21goJkl3evos7ArRqisV3GZFA2q"
export default function PaymentArea() {
  const { theme } = useContext(ThemeContext)
  const [QR, setQR] = useState(""); 
  useEffect(() => {
    const _QR = "https://img.vietqr.io/image/" + MY_BANK.BANK_ID + "-" +
                MY_BANK.ACCOUNT_NO + "-" + MY_BANK.TEMPLATE + ".png?"+
                "&addInfo="+userInSession.accountId+userInSession.phoneNumber+"&accountName=" + MY_BANK.ACCOUNT_NAME;
    setQR(_QR)
  },[])
  
  return (
    <Box className="failed-box">
      <Typography variant="h5">
        DEPOSITE COIN
      </Typography>
      <Card sx={{ width: 250, height: 250, mb: 2 }}>
        <CardMedia
          component="img"
          image={QR}
          alt="QR Code Payment"
          sx={{ objectFit: "contain", width: "100%", height: "100%" }}
        />
      </Card>
      <Typography variant="body1">Scan QR to get coin</Typography>
      <Typography variant="body1">------| 25.000 = 1 coins |-------</Typography>
    </Box>
  );
}