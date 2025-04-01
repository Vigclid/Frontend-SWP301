import axios from "axios";
import { Creator } from "../../Interfaces/UserInterface";
import { Chat, Message } from "../../Interfaces/ChatInterfaces";

const chatURL = `${process.env.REACT_APP_API_URL}/chat/`;
const messagesURL = `${process.env.REACT_APP_API_URL}/message/`;

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