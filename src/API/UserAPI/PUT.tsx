
import axios from 'axios'


const profilecreatorurl = `${process.env.REACT_APP_API_URL}/Creator/`
const backgroundcreatorurl = `${process.env.REACT_APP_API_URL}/Creator/`
const changePasswordURL = `${process.env.REACT_APP_API_URL}/Account/changepassword`
const creatorurl = `${process.env.REACT_APP_API_URL}/Creator/`



export async function PutCreatorBackgroundPicture(CreatorID:string,imageFile:string) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      // Optionally, add additional headers such as Authorization if required
      // 'Authorization': 'Bearer your-token',
    };
    const body = {
      imageFile // Base64 string
    };
    const response = await axios.put(`${backgroundcreatorurl}${CreatorID}/background`, body, { headers });
    console.log('UploadComplete:', response.data);
  } catch (err) {
    console.error(err);
  }
}

export async function PutCreatorProfilePicture(CreatorID:string,imageFile:string) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      // Optionally, add additional headers such as Authorization if required
      // 'Authorization': 'Bearer your-token',
    };
    const body = {
      imageFile // Base64 string
    };
    const response = await axios.put(`${profilecreatorurl}${CreatorID}/avatar`, body, { headers });
    console.log('UploadComplete:', response.data);
  } catch (err) {
    console.error(err);
  }
  }

  export async function PutChangePassword(values:any) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        // Optionally, add additional headers such as Authorization if required
        // 'Authorization': 'Bearer your-token',
      };
      const response = await axios.put(changePasswordURL, values, { headers });
      return response.data;
    } catch (err) {
      console.error(err);
    }
  }



  export async function PutProfile(values:any) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        // Optionally, add additional headers such as Authorization if required
        // 'Authorization': 'Bearer your-token',
      };
      const response = await axios.put(creatorurl+'update-user', values, { headers });
      return response.data;
    } catch (err) {
      console.error(err);
    }
  }