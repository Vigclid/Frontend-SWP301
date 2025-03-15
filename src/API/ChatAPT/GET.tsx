import axios from "axios";
import { Creator } from "../../Interfaces/UserInterface";

const chatURL = `http://localhost:7233/api/chat/`;


export const getChatProfileByUserId = async(id : number) => {
    try {
        const users: Creator[] = await axios.get(`${chatURL}${id}`).then(response => response.data)
        return users;
    } catch {
        return null;
    }
}


