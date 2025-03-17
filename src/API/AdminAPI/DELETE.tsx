import axios from "axios";

const adminurl = "http://localhost:7233/admin";

export async function DeleteArtwork(artworkId: number) {
  try {
    await axios.delete(`${adminurl}/Delete/${artworkId}`);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function RefuseToUpgrade(formId: number) {
  try {
    await axios.delete(`${adminurl}/RefuseToUpgrade/${formId}`);
  } catch (err) {
    console.error(err);
    throw err;
  }
}
