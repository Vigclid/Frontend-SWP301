import axios from "axios";
import { Creator } from "../../Interfaces/UserInterface.tsx";


const FollowUser = `${process.env.REACT_APP_API_URL}/Creator/followers`;
export async function DeleteFollowUser(followerID: number, followingID: number) {
    try {
        const response = await axios.delete(
            FollowUser,
            {
                data: {followerID, followingID},
                headers: {'Content-Type': 'application/json'}
            }
        );
        return response.data;
    } catch (err) {
        throw err;
    }
}
