import { Payment } from "../../Interfaces/PaymentIntrerfaces";
import axios from 'axios'

const getpaymentaccounturl=`${process.env.REACT_APP_API_URL}/Payment/account-qr/`
const paymenturl=`${process.env.REACT_APP_API_URL}/Payment/`

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