import axios from "axios";
import { Creator } from "../../Interfaces/UserInterface";
import { Chat, Message } from "../../Interfaces/ChatInterfaces";

const chatURL = `${process.env.REACT_APP_API_URL}/chat/`;

const headers = {
    'Content-Type': 'application/json',
};

export const updateStatusChatByUserId = async(values : Chat) => {
    try {
        await axios.put(`${chatURL}`,values,{headers}).then(res => res.data)
    } catch {
        return null;
    }
}
