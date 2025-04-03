import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/interact`;

export async function ToggleFavourite(userID: number, artworkID: string) {
  try {
    const response = await axios.post(`${API_URL}/favourite/toggle`, {
      userID,
      artworkID,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm/bỏ Favourite:", error);
    return null;
  }
}

export async function ToggleLike(userID: number, artworkID: number) {
  try {
    const response = await axios.post(`${API_URL}/like/toggle`, {
      userID,
      artworkID,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm/bỏ Like:", error);
    return null;
  }
}
