import axios from "axios";
import { Creator } from "../../Interfaces/UserInterface";
import { Chat, Message } from "../../Interfaces/ChatInterfaces";

const chatURL = `http://localhost:7233/api/chat/`;

const headers = {
    'Content-Type': 'application/json',
};

export const createChat = async(values) => {
    try {
        return axios.post(`${chatURL}`,values,{headers}).then(res => res.data);
    } catch {
        return null;
    }
}