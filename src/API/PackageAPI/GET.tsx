import axios from 'axios'
import { Package,CurrentPackage } from '../../Interfaces/Package';

const packageUrl = `https://localhost:7233/api/Package`
const currentPackage = `https://localhost:7233/api/CurrentPackage/ByCreatorID/`
const allcurrentPackage = `https://localhost:7233/api/CurrentPackage/`

export async function GetPackage() {
    try{
        let packList:Package[] = await axios.get(packageUrl).then(response => response.data)
        return packList
    }catch(err){
      console.log(err)
    }
  }

  export async function GetAllCurrentPackage() {
    try{
        let packList:CurrentPackage[] = await axios.get(allcurrentPackage).then(response => response.data)
        return packList
    }catch(err){
      console.log(err)
    }
  }

  export async function GetCurrentPackageByCreatorID(id: string) {
    try{
        let pack:CurrentPackage = await axios.get(currentPackage+`${id}`).then(response => response.data)
        return pack
    }catch(err){
      console.log(err)
    }
  }

