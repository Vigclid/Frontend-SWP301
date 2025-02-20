import axios from "axios";
import { Package, CurrentPackage } from "../../Interfaces/Package";

const packageUrl = "http://localhost:7233/api/Rank/";
const currentPackage = `http://localhost:7233/api/CurrentPackage/ByCreatorID/`;
const allcurrentPackage = `http://localhost:7233/api/CurrentPackage/`;

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

export async function GetCurrentPackageByCreatorID(id: string) {
  try {
    let pack: CurrentPackage = await axios.get(currentPackage + `${id}`).then((response) => response.data);
    return pack;
  } catch (err) {
    console.log(err);
  }
}
