import React, { useEffect, useState } from "react";
import { Account, Creator } from "../../Interfaces/UserInterface.tsx";
import axios from "axios";

const creatorurl = "http://localhost:7233/api/Creator/";
const creatonobackgroundimageurl = `http://localhost:7233/api/Creator/NotBackground`;
const accountemailurl = "http://localhost:7233/api/Account/email/";
const countcreatorurl = "http://localhost:7233/api/Creator/CountCreators";
const creatorvipstatusurl = `http://localhost:7233/api/Creator/GetID/UserName/Vip`;
const gettotalartworklikesbycreatorurl = `http://localhost:7233/api/artworks/total-likes/`;
const top10UsersUrl = "http://localhost:7233/api/Creator/top-popular";
const checkFollow = "http://localhost:7233/api/Follow/checkFollow";
const getUserByIdUrl = "http://localhost:7233/api/Creator/userID/";


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
