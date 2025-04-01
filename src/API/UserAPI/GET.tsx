import React, { useEffect, useState } from "react";
import { Account, Creator } from "../../Interfaces/UserInterface.tsx";
import axios from "axios";

const creatorurl = `${process.env.REACT_APP_API_URL}/Creator/`;

const accountemailurl = `${process.env.REACT_APP_API_URL}/Account/email/`;
const countcreatorurl = `${process.env.REACT_APP_API_URL}/Creator/CountCreators`;

const gettotalartworklikesbycreatorurl = `${process.env.REACT_APP_API_URL}/artworks/total-likes/`;
const top10UsersUrl = `${process.env.REACT_APP_API_URL}/Creator/top-popular`;
const checkFollow = `${process.env.REACT_APP_API_URL}/Follow/checkFollow`;
const getUserByIdUrl = `${process.env.REACT_APP_API_URL}/Creator/userID/`;

export async function GetUserNameById(userId: string | number) {
  try {
      const response = await axios.get(getUserByIdUrl + userId);
      const userData = response.data;

      if (!userData || (!userData.firstName && !userData.lastName)) {
          console.warn(`⚠️ Không tìm thấy firstName hoặc lastName cho userID ${userId}`);
          return "Unknown User";
      }

      return `${userData.firstName ?? ""} ${userData.lastName ?? ""}`.trim(); // ✅ Ghép firstName + lastName
  } catch (err) {
      console.error(`❌ Lỗi khi lấy userName cho userID ${userId}:`, err);
      return "Unknown User";
  }
}




export async function GetTop10Users() {
  try {
    let users: Creator[] = await axios.get(top10UsersUrl).then((response) => response.data);
    return users;
  } catch (err) {
    console.log("Lỗi khi lấy top 10 người dùng phổ biến:", err);
  }
}

export async function GetTotalLikeByCreatorID(id: string | number) {
  try {
    let total: number = await axios.get(gettotalartworklikesbycreatorurl + id).then((response) => response.data);
    return total;
  } catch (err) {
    console.log(err);
  }
}

export async function GetCreatorListNoImage() {
  try {
    let creatorList: Creator[] = await axios.get(creatorurl.replace(/\/$/, "")).then((response) => response.data);
    return creatorList;
  } catch (err) {
    console.log(err);
  }
}

export async function GetCreatorListNoBackground() {
  try {
    let creatorList: Creator[] = await axios.get(creatorurl).then((response) => response.data);
    return creatorList;
  } catch (err) {
    console.log(err);
  }
}

export async function GetCreatorListCount() {
  try {
    const response = await axios.get(countcreatorurl);
    return response.data as number;
  } catch (err) {
    console.log(err);
    return 0;
  }
}

export async function GetCreatorList() {
  try {
    let creatorList: Creator[] = await axios.get(creatorurl).then((response) => response.data);
    return creatorList;
  } catch (err) {
    console.log(err);
  }
}

export async function GetCreatorByAccountID(accountId: string) {
  //GET by Account ID
  try {
    let creator: Creator = await axios.get(creatorurl + accountId).then((response) => response.data);
    return creator;
  } catch (err) {
    console.log(err);
  }
}

export async function GetCreatorByID(creatorId: string) {
  //GET by Creator ID
  try {
    let creator: Creator = await axios.get(creatorurl + `userID/${creatorId}`).then((response) => response.data);
    return creator;
  } catch (err) {
    console.log(err);
  }
}

export async function GetAccountByEmail(email: string) {
  try {
    let account: Account = await axios.get(accountemailurl + `${email}`).then((response) => response.data);
    return account;
  } catch (err) {
    console.log(err);
  }
}

export async function CheckFollowStatus(followerId: number, followingId: number) {
  try {
    const response = await axios.get(checkFollow, {
      params: {
        followerId,
        followingId,
      },
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (err) {
    throw err;
  }
}
