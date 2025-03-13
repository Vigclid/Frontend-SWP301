
import axios from 'axios'
import {CurrentPackage, Package} from '../../Interfaces/Package';
import {Account} from "../../Interfaces/UserInterface";


const insertRank = "http://localhost:7233/api/Rank/Packages/";


export async function PostRankToUser(data: CurrentPackage) {
    try {
        const headers = {
            'Content-Type': 'application/json',
            // Optionally, add additional headers such as Authorization if required
            // 'Authorization': 'Bearer your-token',
        };
        const response = await axios.post(insertRank, data, { headers });
        console.log('UploadComplete:', response.data);
        return data;
    } catch (err) {
        console.error(err);
    }
}



