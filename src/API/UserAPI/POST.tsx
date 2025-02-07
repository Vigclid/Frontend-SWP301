
import axios from 'axios'
import { Account, Creator } from '../../Interfaces/UserInterface';

const postcreatorurl = 'https://localhost:7233/api/Creator/'
const postaccounturl = 'https://localhost:7233/api/Account/CreateAccount'
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
