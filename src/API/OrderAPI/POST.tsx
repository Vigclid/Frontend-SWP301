
import axios from 'axios'
import { OrderDetails, OrderHeader } from '../../Interfaces/OrderInterfaces';

const createorderheaderurl = `${process.env.REACT_APP_API_URL}/Orders`

const createorderbodyurl = `${process.env.REACT_APP_API_URL}/OrderDetail`

const headers = {
    'Content-Type': 'application/json',
    // Optionally, add additional headers such as Authorization if required
    // 'Authorization': 'Bearer your-token',
  };

export async function PostOrderHeader(values:OrderHeader) {
    try{
        let form:OrderHeader = await axios.post(createorderheaderurl,values,{headers}).then(response => response.data)
        return form
    }catch(err){
      console.log(err)
    }
  }

  export async function PostOrderDetail(values:OrderDetails) {
    try{
        let form:any = await axios.post(createorderbodyurl,values,{headers}).then(response => response.data)
        return form
    }catch(err){
      console.log(err)
    }
  }