
import { ICommissionForm, IExtraCommissionForm } from "../../Interfaces/CommissionForm"
import axios from 'axios'


const getcommssionformurl = `${process.env.REACT_APP_API_URL}/CommissionForm/`

const headers = {
    'Content-Type': 'application/json',
    // Optionally, add additional headers such as Authorization if required
    // 'Authorization': 'Bearer your-token',
  };
export async function PutCommissionFormById(values:ICommissionForm,id:string|number) {
    try{
        let response = await axios.put(getcommssionformurl+id,values,{headers}).then(response => response.data)
        return response
    }catch(err){
      console.log(err)
    }
  }