  import axios from "axios";
import { Package, CurrentPackage } from "../../Interfaces/Package";

const packageUrl = `${process.env.REACT_APP_API_URL}/Rank/`;
const currentPackage = `${process.env.REACT_APP_API_URL}/Rank/Current/`;
const allcurrentPackage = `${process.env.REACT_APP_API_URL}/CurrentPackage/`;

export async function GetPackage() {
  try {
    let packList: Package[] = await axios.get(packageUrl).then((response) => response.data);
    return packList;
  } catch (err) {
    console.log(err);
  }
}

export async function GetAllCurrentPackage() {
  try {
    let packList: CurrentPackage[] = await axios.get(allcurrentPackage).then((response) => response.data);
    return packList;
  } catch (err) {
    console.log(err);
  }
}


export async function GetCurrentPackageByAccountID(id: number | undefined) {
  if (!id) {
    console.error("⚠️ Error: AccountID is undefined or null");
    return null; // Tránh gọi API nếu id không hợp lệ
  }
  try {
    console.log(`🔍 Fetching CurrentPackage for AccountID: ${id}`);
    let response = await axios.get(currentPackage + `${id}`);
    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (err) {
    console.error("❌ Error fetching CurrentPackage:", err);
    return null;
  }
}
