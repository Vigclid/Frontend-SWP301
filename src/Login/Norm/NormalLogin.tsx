import axios from "axios";
import React from "react";
import { Creator } from "../../Interfaces/UserInterface";

const accounturl = `${process.env.REACT_APP_API_URL}/Account`;
const creatorurl = `${process.env.REACT_APP_API_URL}/Creator/`;
const roleurl = `${process.env.REACT_APP_API_URL}/Role/`;

type initialUser = {
  accountId: number;
  roleID: number;
  password: "";
  email: "";
  status: number;
};

type roles = {
  roleId: number;
  roleName: string;
};

export function NormalLogin() {
  return <div>NormalLogin</div>;
}

export async function CheckLogin(checkAccount: initialUser, storeUserData: any) {
  try {
    // const response = await axios.get(accounturl);
    // const listOfAccounts = response.data;
    let foundAccount: initialUser | undefined;
    // const foundAccount:initialUser = listOfAccounts.find((account: { email: string; password: string }) => account.email === checkAccount.email && account.password === checkAccount.password);
    try {
      const response = await axios.get(`${accounturl}/${checkAccount.email}/${checkAccount.password}`);
      console.log(response);
      foundAccount = response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        console.log("Không tìm thấy tài khoản (404).");
        // Xử lý trường hợp không tìm thấy tài khoản
      } else {
        console.error("Có lỗi xảy ra:", error);
        // Xử lý các lỗi khác nếu cần
      }
    }

    if (foundAccount) {
      //Get the user roles
      const userroleResponse = await axios.get(roleurl + foundAccount.roleID);
      const userrole: roles = userroleResponse.data;
      //Store the user role in sesison
      userrole.roleName === "Admin"
        ? sessionStorage.setItem("userRole", "AD")
        : sessionStorage.setItem("userRole", userrole.roleName);
      // Once the user is verified, get additional user data.
      const creatorResponse = await axios.get(creatorurl + foundAccount.accountId);
      const creatorData: Creator = creatorResponse.data;
      const creatorWithoutTheImages = {
        ...creatorData,
        email: foundAccount.email,
      };
      storeUserData(creatorWithoutTheImages);
    } else {
      alert("No account found or Banned Account");
    }
  } catch (err) {
    console.log(err);
  }
}
