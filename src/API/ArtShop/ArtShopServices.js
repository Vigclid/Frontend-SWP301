import axios from "axios";

const arturl = "http://localhost:7233/api/artworks";
const arturlVnpayPayment = "https://localhost:7233";

export const getArtWithStatus = (userId, pageNumber) => {
  return axios.get(
    `${arturl}/GetArtworksWithPaymentStatus?userId=${userId || ''}&pageNumber=${pageNumber || 1}&pageSize=8`
  );
};

export const getArtDetail = (id) => {
  return axios.get(arturl + "/" + id);
};

export const VnpayPayment = (payload) => {
  return axios.post(arturlVnpayPayment + "/Payment", payload);
};