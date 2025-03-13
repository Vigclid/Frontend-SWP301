import { Payment } from "../../Interfaces/PaymentIntrerfaces";
import axios from 'axios'

const getpaymentadminurl="http://localhost:7233/api/Payment/admin-qr"
const getpaymentaccounturl=`http://localhost:7233/api/Payment/account-qr/`
const paymenturl=`http://localhost:7233/api/Payment/`

export async function GetPaymentAdmin() {
    try{
        // let form:string|null = await axios.get(getpaymentadminurl).then(response => response.data)
        // return form
    }catch(err){
      console.log(err)
    }
  }
  export async function GetPaymentAccount(id:string) {
    try{
        // let form:Payment = await axios.get(getpaymentaccounturl+id).then(response => response.data)
        // return form
        
    }catch(err){
      console.log(err)
    }
  }

export const getPaymentsByUserId = async(id : string) =>{
  try{
    let payments:Payment[] = await axios.get(paymenturl+id).then(response => response.data)
    return payments
    
}catch(err){
  console.log(err)
}
}


export const checkPaymentTransCodeExist = async(code : string) => {
  try {
    let payments:string = await axios.get(paymenturl+`checktranscode/`+code).then(response => response.data)
    return payments;
  }catch(err){
    console.log(err);
  }
}