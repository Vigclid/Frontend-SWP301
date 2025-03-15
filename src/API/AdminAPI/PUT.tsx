import axios from "axios";

const adminurl = "http://localhost:7233/admin";

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

export async function UpdateReportStatus(reportId: number) {
  try {
    await axios.put(`${adminurl}/updateStatus/${reportId}`);
  } catch (err) {
    console.error(err);
    throw err;
  }
}
