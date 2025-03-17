import axios from "axios";
import { Creator } from "../../Interfaces/UserInterface";
import { Chat, Message } from "../../Interfaces/ChatInterfaces";

const chatURL = `http://localhost:7233/api/chat/`;
const messagesURL = `http://localhost:7233/api/message/`;

const headers = {
    'Content-Type': 'application/json',
};

export const createChat = async(values) => {
    try {
        return await axios.post(`${chatURL}`,values,{headers}).then(res => res.data);
    } catch {
        return null;
    }
}


export const sendMessage = async(values : Message) => {
    try {
        await axios.post(`${messagesURL}`,values,{headers}).then(res => res.data)
    } catch {
        return null;
    }
}