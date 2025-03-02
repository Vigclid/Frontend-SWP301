import React, { useContext, useEffect , useState } from "react";
import { Box, Card, CardMedia, Typography, Button, Container } from "@mui/material";
import { ThemeContext } from '../Themes/ThemeProvider.tsx';
import '../../css/PaymentArea.css'
import { Creator } from "../../Interfaces/UserInterface.ts";
import { Payment } from "../../Interfaces/PaymentIntrerfaces.ts";
import axios from "axios";
import {PostPayment} from "../../API/PaymentAPI/POST.tsx"
import LoadingScreen from '../LoadingScreens/LoadingScreenSpokes.jsx';
import CustomizedPopperPayment from "./CustomizedPopperPayment.tsx";


const MY_BANK = {

  BANK_ID : "970422", //MB Bank
  ACCOUNT_NO : "0356759177",
  TEMPLATE: "qr_only",
  ACCOUNT_NAME: "Doan Xuan Son"
}

export default function PaymentArea( {setShowPayment , setAmount}) {
  // Attempt to retrieve the auth state from sessionStorage
const savedAuth = sessionStorage.getItem("auth");
// Check if there's any auth data saved and parse it
const userInSession: Creator = savedAuth ? JSON.parse(savedAuth) : "";

// Now 'auth' contains your authentication state or null if there's nothing saved
const QR = "https://img.vietqr.io/image/" + MY_BANK.BANK_ID + "-" +
                MY_BANK.ACCOUNT_NO + "-" + MY_BANK.TEMPLATE + ".png?"+
                "&addInfo="+userInSession.accountId+userInSession.phoneNumber+"&accountName=" + MY_BANK.ACCOUNT_NAME
const AppScirpt = "https://script.googleusercontent.com/macros/echo?user_content_key=BkINLbtlTn49vfGL7uDFErRGyFRs-i-0j4f98qZpOrySgH3A4XWudFvBAnnOOluUkSRIgUXC0-Ikkbmzr1rJCIA5e_tt4tP5m5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnDzsAlD6ug9FsXOxdoyN-BO226sy0AJl2UoKLOqjRp3h9KpIYTSbk9vet7j5ea-Rg4Ol3lRZLwCEBiCs-ictM-yoBFes96d7Hg&lib=MLQuxm21goJkl3evos7ArRqisV3GZFA2q"

  const [success, setSuccess] = useState<boolean>(false)
  const { theme } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const checkPaid = async () => {
    try {
      if (success) return; // Nếu đã thanh toán, không kiểm tra nữa

      const response = await axios.get(AppScirpt);
      const data = response.data;
      const FinalRes = data.data; 

      for (const BankData of FinalRes) {
        const lastPrice = BankData["Giá trị"];  
        const lastContent = BankData["Mô tả"];
        const lastTransCode = BankData["Mã GD"];

        if (String(lastContent).trim().includes(`${userInSession.accountId}${userInSession.phoneNumber}`)) {
          setIsLoading(prev => !prev)

          const Payment: Payment = {
            amount: Number(lastPrice),
            transCode: lastTransCode,
            userId: Number(userInSession.userId),
          };
          
          const check = await PostPayment(Payment);
          console.log("Check result:", check);
          if (check === true) {
            console.log("✅ Thanh toán thành công! Cập nhật success...");
            setSuccess(true);
            setAmount(Number(lastPrice)/25000)
            setShowPayment(true);
          }
        }
      }
    } catch (err) {
      console.error("Lỗi:", err);
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (!success) {
      checkPaid(); // Kiểm tra ngay khi component mount

      intervalId = setInterval(() => {
        checkPaid();
      }, 2000);
    }

    return () => {
      if (intervalId) {
        console.log("⏹️ Dừng kiểm tra thanh toán...");
        clearInterval(intervalId);
      }
    };
  }, [success]); // Theo dõi success, nếu true thì cleanup interval


  return (
    <Box>
      <Box className={success  ? "successed-box" : "failed-box"}>
        <Typography variant="h5" className={success  ? "gradient-text-successed" : "gradient-text-failed"} sx={{mb : 5}}>
          DEPOSITE COIN
        </Typography>
        <Card sx={{ position: "relative", width: 250, height: 250, mb: 5 ,overflow: "visible" }}>
          <CardMedia
            className="QRimg"
            component="img"
            image={QR}
            alt="QR Code Payment"
            sx={{ objectFit: "contain", width: "100%", height: "100%" }}
          />
          <div className="scan-line"></div>
          <span className="corner TL"></span>
          <span className="corner TR"></span>
          <span className="corner BL"></span>
          <span className="corner BR"></span>
        </Card>
        <Typography variant="h5">Scan QR 
                    to deposite coins</Typography>
        <Typography variant="h6" className="VND-COIN">25.000 VND = 1 COIN </Typography>

      </Box> 
    </Box>
  );
}