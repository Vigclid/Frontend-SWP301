import * as React from "react";
import Dialog from "@mui/material/Dialog";
import "../../css/ArtConfirm.css";
import { useNavigate } from "react-router-dom";
import { Package, CurrentPackage } from "../../Interfaces/Package";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import {PostRankToUser} from "../../API/PackageAPI/POST.tsx"
interface PackagePaymentConfirmProps {
  open: boolean;
  item?: Package;
  handleClose: () => void;
  onPackagePurchased?: (newPackage: CurrentPackage) => void;
}


export default function PackagePaymentConfirm({
                                                open,
                                                item,
                                                handleClose,
                                                onPackagePurchased,
                                              }: PackagePaymentConfirmProps) {
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const auth = JSON.parse(sessionStorage.getItem("auth") ?? "{}");

  React.useEffect(() => {
    if (!item) {
      console.log("No valid item, closing dialog");
      handleClose();
    }
  }, [item, handleClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || !auth.accountId) return;

    try {
      setLoading(true);
      const paymentData = {
        packageID: item.typeId,
        packageName: item.typeRankName,
        packagePrice: item.price,
        accountId: auth.accountId,
      };

      if (auth.coins - paymentData.packagePrice < 0) {
        alert("Your money don't enough to upgrade, please deposit more");
        navigate("/characters/depositecoin");
        console.error("Payment failed: Insufficient coins");
      } else {
        // Tạo đối tượng CurrentPackage để gửi lên server
        const rankDTO: CurrentPackage = {
          rankID: 0,
          dayToRentRankAt: new Date().toISOString(), // Ngày hiện tại dạng ISO
          typeID: item.typeId,
          accountID: auth.accountId,
          price: item.price,
        };

        // Gọi API để cập nhật package
        const response = await PostRankToUser(rankDTO);
        console.log("Package updated successfully:", response);

        // Thông báo thành công và cập nhật state ở component cha
        alert("Package purchased successfully!");
        if (onPackagePurchased) {
          onPackagePurchased(rankDTO); // Gửi dữ liệu lên cha để cập nhật currentPackage
        }
        handleClose();
      }
    } catch (error) {
      console.error("Error during payment:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (!item) return null;

  return (
      <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="dialog-custom"
          sx={{ borderRadius: 50, background: "none" }}
      >
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 100 }} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <section className="add-card page">
          <form className="form" onSubmit={handleSubmit}>
            <label htmlFor="name" className="label">
              <span className="title">Package Name</span>
              <input
                  className="input-field"
                  type="text"
                  name="packageName"
                  value={item.typeRankName || ""}
                  readOnly
                  title="Package name"
              />
            </label>
            <label htmlFor="price" className="label">
              <span className="title">Price</span>
              <input
                  id="price"
                  className="input-field"
                  value={item.price !== undefined ? `${item.price}$` : ""}
                  readOnly
                  name="price"
                  title="Package price"
              />
            </label>
            <button className="checkout-btn" type="submit" disabled={loading}>
              {loading ? "Processing..." : "Confirm Purchase"}
            </button>
            <button
                className="checkout-btn cancel-btn"
                type="button"
                onClick={handleClose}
                style={{ marginTop: "10px", backgroundColor: "#ccc" }}
            >
              Cancel
            </button>
          </form>
        </section>
      </Dialog>
  );
}

