import axios from "axios";

const adminurl = `http://${process.env.REACT_APP_DNS}/admin`;

interface ArtistFormDTO {
  formId: number;
  descriptions: string;
  status: number;
  dateCreation: string;
  userId: number;
  rankID: number;
}

export async function LockAccount(accountId: number) {
  try {
    await axios.put(`${adminurl}/LockAccount/${accountId}`);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function UnlockAccount(accountId: number) {
  try {
    await axios.put(`${adminurl}/UnlockAccount/${accountId}`);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function AcceptToUpgrade(dto: ArtistFormDTO) {
  try {
    await axios.put(`${adminurl}/AcceptToUpgrade/`, dto);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function UpdateReportStatus(reportId: number) {
  try {
    await axios.put(`${adminurl}/updateStatus/${reportId}`);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export const AcceptWithdraw = async (withdrawId: number) => {
  try {
    const response = await axios.put(adminurl + `/AcceptWithdraw/${withdrawId}`);
    return response.data;
  } catch (error) {
    console.error("Error accepting withdraw:", error);
    throw error;
  }
};
