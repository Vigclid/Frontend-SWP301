import axios from 'axios'
import { MoneyTransfer, Payment } from "../../Interfaces/PaymentIntrerfaces";

const paymenturl=`${process.env.REACT_APP_API_URL}/Payment`
const headers = {
    'Content-Type': 'application/json',
    // Optionally, add additional headers such as Authorization if required
    // 'Authorization': 'Bearer your-token',
  };
  export async function PostPayment(value:Payment) {
    try{
        let response = await axios.post(paymenturl,value,{headers}).then(response => response.data)
        return response
        
    }catch(err){
      console.log(err)
    }}


export const saveNewMoneyTransfer = async(value: MoneyTransfer) => {
  try{
        let response = await axios.post(paymenturl+"/",value,{headers}).then(response => response.data)
        return response
        
    }catch(err){
      console.log(err)
    }
}