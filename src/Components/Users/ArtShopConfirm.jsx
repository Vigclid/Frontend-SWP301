import * as React from "react";
import Dialog from "@mui/material/Dialog";
import "../../css/ArtConfirm.css";
import { Buyart } from "../../API/ArtShop/ArtShopServices.tsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ArtShopConfirm(props) {
  let { open, item, handleClose } = props;
  const auth = JSON.parse(sessionStorage.getItem("auth"));
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [userCoins, setUserCoins] = React.useState(0);
  const [showInsufficientFunds, setShowInsufficientFunds] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchUserCoins = async () => {
      try {
        if (auth?.accountId) {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/Creator/` + auth.accountId);
          setUserCoins(response.data?.coins || 0);
        }
      } catch (error) {
        console.error("Error fetching user coins:", error);
      }
    };

    fetchUserCoins();
  }, [auth?.accountId]);

  const handleInsufficientFunds = () => {
    setShowInsufficientFunds(true);
    setTimeout(() => {
      setShowInsufficientFunds(false);
      handleClose();
      navigate("/characters/depositecoin");
    }, 3000);
  };

  const handleSuccess = (artworkID) => {
    setShowSuccess(true);
    setTimeout(() => {
      handleClose();
      setShowSuccess(false);
      window.location.href = `/characters/artwork/${artworkID}`;
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!item || !auth) {
        throw new Error("Missing item or auth data");
      }

      // Parse values - ensure we're getting clean numbers
      const price = parseFloat(String(item.price).replace(/[^\d.]/g, ""));
      const sellerID = parseInt(String(item.creatorID).trim());
      const buyerID = parseInt(String(auth.userId).trim());
      const artworkID = parseInt(String(item.artworkID).trim());

      // Check if user has enough coins
      if (userCoins < price) {
        handleInsufficientFunds();
        return;
      }

      // Validate conversions
      if (isNaN(price) || price <= 0) {
        throw new Error("Invalid price value");
      }
      if (isNaN(sellerID) || isNaN(buyerID) || isNaN(artworkID)) {
        throw new Error("Invalid ID values");
      }

      // Format the date to match backend expectation
      const now = new Date();
      const formattedDate =
        now.getFullYear() +
        "-" +
        String(now.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(now.getDate()).padStart(2, "0") +
        "T" +
        String(now.getHours()).padStart(2, "0") +
        ":" +
        String(now.getMinutes()).padStart(2, "0") +
        ":" +
        String(now.getSeconds()).padStart(2, "0") +
        "." +
        String(now.getMilliseconds()).padStart(3, "0");

      const payload = {
        transactionID: 0,
        price,
        buyDate: formattedDate,
        sellerID,
        buyerID,
        artworkID,
      };

      const data = await Buyart(payload);

      if (data?.success) {
        handleSuccess(item.artworkID);
      } else {
        setError(data?.message || "Transaction failed");
      }
    } catch (error) {
      console.error("Transaction failed:", error);
      setError("Failed to process transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="dialog-custom">
        <section className="add-card page">
          <form className="form" onSubmit={handleSubmit}>
            <label htmlFor="name" className="label">
              <span className="title">Image name</span>
              <input
                className="input-field"
                type="text"
                name="imagename"
                value={item?.artworkName}
                title="Image name"
                placeholder=""
                readOnly
              />
            </label>
            <label htmlFor="userCoins" className="label">
              <span className="title">Your Balance</span>
              <input className="input-field" type="text" value={`${userCoins} Coins`} readOnly />
            </label>
            <label htmlFor="serialCardNumber" className="label">
              <span className="title">Price</span>
              <input
                id="serialCardNumber"
                className="input-field"
                value={item?.price ? `${item.price} Coins` : ""}
                name="price"
                title="Input title"
                placeholder=""
                readOnly
              />
            </label>
            {error && <div className="error-message">{error}</div>}
            <button className="checkout-btn" type="submit" disabled={loading}>
              {loading ? "Processing..." : "Checkout"}
            </button>
          </form>
        </section>
      </Dialog>

      {/* Insufficient funds popup */}
      <Dialog open={showInsufficientFunds} aria-labelledby="insufficient-funds-dialog" className="dialog-custom">
        <div className="insufficient-funds-dialog status-dialog">
          <h2>Insufficient Funds</h2>
          <p>You will be redirected to deposit page...</p>
        </div>
      </Dialog>

      {/* Success popup */}
      <Dialog open={showSuccess} aria-labelledby="success-dialog" className="dialog-custom">
        <div className="success-dialog status-dialog">
          <h2>Purchase Successful!</h2>
          <p>You will be redirected to artwork page...</p>
        </div>
      </Dialog>
    </>
  );
}
