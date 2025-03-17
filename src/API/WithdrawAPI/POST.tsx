import axios from "axios";
import { WithdrawInterfaces } from "../../Interfaces/WithdrawInterfaces";

export const SendWithdrawForm = async (withdrawData: Partial<WithdrawInterfaces>) => {
  try {
    const response = await axios.post("http://localhost:7233/api/withdraw", withdrawData);
    return response.data;
  } catch (error) {
    console.error("Error in SendWithdrawForm:", error);
    throw error;
  }
};
