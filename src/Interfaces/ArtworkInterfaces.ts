import { Download } from "@mui/icons-material";
export interface Artwork {
  artworkID: string;
  creatorID: string;
  artworkName: string;
  description: string;
  dateCreated: string;
  likes: number;
  purchasable: boolean;
  price: number;
  views: number;
  imageFile: string;
  artworkTag: [
    {
      artworkTagID: number;
      artworkID: number;
      tagID: number;
    }
  ];
}

export interface ArtworkPaymentStatus {
  status: boolean;
}

export interface DownloadArtwork extends Artwork {
  artworkID: string;
  creatorID: string;
  artworkName: string;
  description: string;
  dateCreated: string;
  likes: number;
  purchasable: boolean;
  price: number;
  imageFile: string;
  idDowLoad: string;
  artworkTag: [
    {
      artworkTagID: number;
      artworkID: number;
      tagID: number;
    }
  ];
}

export interface ArtworkTransaction {
  transactionID: number;
  price: number;
  buyDate: string;
  sellerID: number;
  buyerID: number;
  artworkID: number;
}
