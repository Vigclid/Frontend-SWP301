import { Download } from '@mui/icons-material';
export interface Artwork{
  artworkID: string,
  creatorID: string,
  artworkName: string,
  description: string,
  dateCreated: Date,
  likes: number,
  favourites: number,
  purchasable: boolean,
  price: number,
  imageFile: string,
  isFavourite?: boolean,
  artworkTag: [
    {
      "artworkTagID": number,
      "artworkID": number,
      "tagID": number
    },   
  ]
  
}

export interface ArtworkPaymentStatus{
  status: boolean
}

export interface DownloadArtwork extends Artwork{
  artworkID: string,
  creatorID: string,
  artworkName: string,
  description: string,
  dateCreated: Date,
  likes: number,
  purchasable: boolean,
  price: number,
  imageFile: string,
  idDowLoad: string,
  artworkTag: [
    {
      "artworkTagID": number,
      "artworkID": number,
      "tagID": number
    },
  ]
}