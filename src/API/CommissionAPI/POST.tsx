import axios from 'axios'
import { ICommissionForm, ICommissionID } from '../../Interfaces/CommissionForm'

const commissionIdurl = "https://localhost:7233/api/Commission"
const commissionFromCreate = "https://localhost:7233/api/CommissionForm"

const headers = {
    'Content-Type': 'application/json',
    // Optionally, add additional headers such as Authorization if required
    // 'Authorization': 'Bearer your-token',
  };

  export async function GetCommissionID() {
    const response = await axios.post("https://localhost:7233/api/Commission/request");
    return response.data;
  }
  

export async function CreateCommissionForm(value) {
    try{
        let response = await axios.post(commissionFromCreate,value,{headers}).then(response => response.data)
        return response
        
    }catch(err){
      console.log(err)
    }
}
