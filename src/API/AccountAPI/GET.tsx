import React, { useEffect, useState } from "react";
import { Account } from "../../Interfaces/UserInterface.tsx";
import axios from "axios";

const getaccountbyaccountid = `http://localhost:7233/api/Account/`;
const getallaccounts = `http://localhost:7233/api/Account`

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

export async function getAllAccounts() {
  try {
    let account: Account[] = await axios.get(getallaccounts)
        .then((response) => response.data);
    return account;
  } catch (err) {
    console.log(err);
  }
}


