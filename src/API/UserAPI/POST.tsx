
import axios from 'axios'
import { Account, Creator } from '../../Interfaces/UserInterface';
import {Follow} from '../../Interfaces/FollowingInterface';

const postcreatorurl = `${process.env.REACT_APP_API_URL}/Creator/`
const postaccounturl = `${process.env.REACT_APP_API_URL}/Account/CreateAccount`
const changePasswordURL = `${process.env.REACT_APP_API_URL}/Account/changepassword`
const followUser = `${process.env.REACT_APP_API_URL}/Creator/followers`;

export async function PostUserAccount(values:Account) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      // Optionally, add additional headers such as Authorization if required
      // 'Authorization': 'Bearer your-token',
    };
    const response = await axios.post(postaccounturl, values, { headers });
    console.log('UploadComplete:', response.data);
    let account:Account = response.data
    return account
  } catch (err) {
    console.error(err);
  }
}
export async function PostChangePassword(values:any) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      // Optionally, add additional headers such as Authorization if required
      // 'Authorization': 'Bearer your-token',
    };
    const response = await axios.post(changePasswordURL, values, { headers });
    console.log('UploadComplete:', response.data);
    let account:Account = response.data
    return account
  } catch (err) {
    console.error(err);
  }
}



export async function PostCreator(values:Creator) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        // Optionally, add additional headers such as Authorization if required
        // 'Authorization': 'Bearer your-token',
      };
      const response = await axios.post(`${postcreatorurl}`, values, { headers }); //WORK in USERAPI
      console.log('UploadComplete:', response.data);
    } catch (err) {
      console.error(err);
    }
  }

export async function PostFollowUser(values:Follow) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      // Optionally, add additional headers such as Authorization if required
      // 'Authorization': 'Bearer your-token',
    };
    const response = await axios.post(followUser, values, { headers });
    console.log('Follow Complete:', response.data);
  } catch (err) {
    console.error(err);
  }
}
