
import axios from 'axios'


const profilecreatorurl = 'http://localhost:7233/api/Creator/'
const backgroundcreatorurl = 'http://localhost:7233/api/Creator/'
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