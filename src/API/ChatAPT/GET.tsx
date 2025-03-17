import axios from "axios";
import { Creator } from "../../Interfaces/UserInterface";
import { Chat, Message } from "../../Interfaces/ChatInterfaces";

const chatURL = `http://localhost:7233/api/chat/`;
const messagesURL = `http://localhost:7233/api/message/`;

export const getChatProfileByUserId = async(id : number) => {
    try {
        const users: Creator[] = await axios.get(`${chatURL}${id}`).then(response => response.data)
        return users;
    } catch {
        return null;
    }
}

export const getChatByUserId= async (id : number) => {
    try {
        const chats : Chat[] = await axios.get(`${chatURL}ch/${id}`).then(res => res.data)
        return chats;
    } catch {
        return null;
    }
}


export const getMessageBySenderId = async (id : number) => {
    try {
        const messages : Message[] = await axios.get(`${chatURL}messages/${id}`).then(res => res.data);
        return messages;
    } catch {
        return null;
    }
}