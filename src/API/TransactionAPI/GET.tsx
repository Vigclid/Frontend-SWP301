import axios from "axios";
const BASE_URL = "http://localhost:7233/api/transaction";

export const GetBuyerTransactions = async (buyerId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/ListTransactionBuyer/${buyerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching buyer transactions:", error);
    return null;
  }
};

export const GetSellerTransactions = async (sellerId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/ListTransactionSeller/${sellerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching seller transactions:", error);
    return null;
  }
};
