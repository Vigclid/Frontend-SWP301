import axios from "axios";

const adminurl = "http://localhost:7233/admin";

export async function GetListArtistForm() {
  try {
    const response = await axios.get(adminurl + "/GetListArtistForm");
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function GetListReportsUnfinished() {
  try {
    const response = await axios.get(adminurl + "/ListReportsUnfinished");
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function GetListReportsFinished() {
  try {
    const response = await axios.get(adminurl + "/ListReportsFinished");
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function GetListUser() {
  try {
    const response = await axios.get(adminurl + "/GetListUserForAdmin");
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function GetNumberOfUser() {
  try {
    const response = await axios.get(adminurl + "/numberofuser");
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function GetNumberOfArtwork() {
  try {
    const response = await axios.get(adminurl + "/numberofartwork");
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function GetListActivity() {
  try {
    const response = await axios.get(adminurl + "/ListActivity");
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function GetListAllTransactions() {
  try {
    const response = await axios.get(adminurl + "/ListAllTransactions");
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function GetListPayment() {
  try {
    const response = await axios.get(adminurl + "/ListPayment");
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export const GetListWithdrawInProgress = async () => {
  try {
    const response = await axios.get(adminurl + "/GetListWithdrawInProgress");
    return response.data;
  } catch (error) {
    console.error("Error fetching withdrawals in progress:", error);
    throw error;
  }
};

export const GetListWithdrawBeAccept = async () => {
  try {
    const response = await axios.get(adminurl + "/GetListWithdrawBeAccept");
    return response.data;
  } catch (error) {
    console.error("Error fetching accepted withdrawals:", error);
    throw error;
  }
};
