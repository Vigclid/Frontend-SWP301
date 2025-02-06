
import axios from 'axios'
import { Package } from '../../Interfaces/Package';

const packagePayment = 'https://localhost:7233/api/Package/Purchase'

export const VnpayPackagePayment = async(vipPackage:Package) => {
    const data = await axios.post(packagePayment, vipPackage);
    return data
  };
  