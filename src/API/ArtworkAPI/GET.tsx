import { Artwork, ArtworkPaymentStatus } from "../../Interfaces/ArtworkInterfaces";
import axios from "axios";

const arturl = `${process.env.REACT_APP_API_URL}/artworks/`;
const top10arturl = `${process.env.REACT_APP_API_URL}/artworks/`;
const random10arturl = `${process.env.REACT_APP_API_URL}/artworks/`;
const artworkbycreatorurl = `${process.env.REACT_APP_API_URL}/artworks/accountID/`;
const numberartworkurl = `${process.env.REACT_APP_API_URL}/artworks/`;
const nearest7artworkurl = `${process.env.REACT_APP_API_URL}/artworks/`;
const artworkbycreatornoimageurl = `${process.env.REACT_APP_API_URL}/artworks/`;
const recentartworks = `${process.env.REACT_APP_API_URL}/artworks/`;
const artworkyidnoimageurl = `${process.env.REACT_APP_API_URL}/artworks/`;
const artworkByTagName = `${process.env.REACT_APP_API_URL}/artworks/Tag`;
const API_URL = `${process.env.REACT_APP_API_URL}/interact`;
const transactionurl = `${process.env.REACT_APP_API_URL}/transaction`;

export async function GetArtsPaymentStatus(creatorId: string, artworkId: string): Promise<ArtworkPaymentStatus | null> {
  try {
    const response = await axios.get<ArtworkPaymentStatus>(
      `${transactionurl}/TransactionsChecking/${creatorId}/${artworkId}`
    );
    return response.data; // { status: true } hoặc { status: false }
  } catch (err) {
    console.error("Error fetching payment status:", err);
    return null;
  }
}

export async function GetArtsNoImageByCreatorId(id: string) {
  try {
    let artwork: Artwork[] = await axios.get(artworkbycreatornoimageurl + id).then((response) => response.data);
    return artwork;
  } catch (err) {
    console.log(err);
  }
}

export async function GetRecentArtListLikeCount() {
  try {
    const response = await axios.get(recentartworks);
    const artList: Artwork[] = Array.isArray(response.data) ? response.data : [];
    return artList.map((art) => ({
      ...art,
      artworkID: String(art.artworkID || ""),
      artworkName: String(art.artworkName || ""),
      likes: Number(art.likes || 0),
    }));
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function GetArtListCount() {
  try {
    let artList: number = await axios.get(numberartworkurl).then((response) => response.data);
    return artList;
  } catch (err) {
    console.log(err);
  }
}

export async function GetRecent7ArtList() {
  try {
    let artList: Artwork[] = await axios.get(nearest7artworkurl).then((response) => response.data);
    return artList;
  } catch (err) {
    console.log(err);
  }
}

export async function GetArtList() {
  try {
    let response = await axios.get(arturl);
    console.log("✅ API Response:", response.data);
    console.log(arturl);
    return response.data;
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách Artwork:", err);
    console.log(arturl);
  }
}

export async function GetTop10Arts() {
  try {
    let artList: Artwork[] = await axios.get(top10arturl).then((response) => response.data);
    return artList;
  } catch (err) {
    console.log(err);
  }
}

export async function GetRandom10Arts() {
  try {
    let artList: Artwork[] = await axios.get(random10arturl).then((response) => response.data);
    return artList;
  } catch (err) {
    console.log(err);
  }
}

export async function GetArtsByCreatorId(id: string) {
  try {
    let artwork: Artwork[] = await axios.get(artworkbycreatorurl + id).then((response) => response.data);
    return artwork;
  } catch (err) {
    console.log(err);
  }
}

export async function GetArtsByAccountId(id: string) {
  try {
    let artwork: Artwork[] = await axios.get(artworkbycreatorurl + id).then((response) => response.data);
    return artwork;
  } catch (err) {
    console.log(err);
  }
}

export async function GetArtById(id: string) {
  try {
    let artwork: Artwork = await axios.get(arturl + id).then((response) => response.data);
    console.log("artwork result: ", artwork);
    return artwork;
  } catch (err) {
    console.log(err);
  }
}

export async function GetArtByIdNoImage(id: string) {
  try {
    let artwork: Artwork = await axios.get(artworkyidnoimageurl + id).then((response) => response.data);
    return artwork;
  } catch (err) {
    console.log(err);
  }
}

export async function GetArtworkByTagName(tagName: string): Promise<Artwork[] | undefined> {
  try {
    const response = await axios.get(`${artworkByTagName}?tagName=${tagName}`);
    return response.data;
  } catch (err) {
    console.error("Error fetching artwork by tag name:", err);
    return undefined;
  }
}

export async function GetFavouritesArtworks(userID: number) {
  try {
    const response = await axios.get(`${API_URL}/favourite/${userID}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách Artwork yêu thích:", error);
    return [];
  }
}

export async function CheckFavouriteStatus(userID: number, artworkID: number) {
  try {
    const response = await axios.get(`${API_URL}/favourite/status/${userID}/${artworkID}`);
    return response.data; // Trả về true/false
  } catch (error) {
    console.error("Lỗi khi kiểm tra trạng thái favourite:", error);
    return false;
  }
}

export async function CheckLikeStatus(userID: number, artworkID: number) {
  try {
    const response = await axios.get(`${API_URL}/like/status/${userID}/${artworkID}`);
    return response.data; // Trả về true/false
  } catch (error) {
    return false;
  }
}

export const GetLikeCount = async (artworkID: number) => {
  try {
    const response = await axios.get(`${API_URL}/like/count/${artworkID}`).then(res => res.data);
    return await response;
  } catch (error) {
    console.error("Error getting like count:", error);
    return 0;
  }
};
