import React, { useEffect, useState } from "react";
import { Account } from "../../Interfaces/UserInterface.tsx";
import axios from "axios";

const getaccountbyaccountid = `${process.env.REACT_APP_API_URL}/Account/`;

export async function getAccountByAccountId(AccountId: string | number) {
  try {
    let account: Account = await axios
      .get(getaccountbyaccountid + AccountId)
      .then((response) => response.data);
    return account;
  } catch (err) {
    console.log(err);
  }
}
