import axios from "axios";
import { Artwork } from "../../Interfaces/ArtworkInterfaces.ts";

const updateurl = `${process.env.REACT_APP_API_URL}/artworks/update`; 

export async function UpdateArtwork(updatedArtwork: Artwork) {
  try {
    const headers = {
      "Content-Type": "application/json",
      // Optionally, add additional headers such as Authorization if required
      // 'Authorization': 'Bearer your-token',
    };
    const body = {
      artwork: updatedArtwork,
    };
    const response = await axios.put(updateurl, body, { headers });
    // return response.data;
    console.log("UploadComplete:", response.data); // Trả về dữ liệu cập nhật từ server
  } catch (err) {
    console.error("Lỗi khi cập nhật artwork:", err);
    throw err;
  }
}
