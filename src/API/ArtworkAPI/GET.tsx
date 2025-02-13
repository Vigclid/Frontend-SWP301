
import { Artwork, ArtworkPaymentStatus } from '../../Interfaces/ArtworkInterfaces' 
import axios from 'axios'


const arturl = "https://localhost:7233/api/artworks/"
const top10arturl = `https://localhost:7233/api/artworks/Top10Liked`
const random10arturl = `https://localhost:7233/api/artworks/random10`
const artworkbycreatorurl = `https://localhost:7233/api/artworks/ByCreatorID/`
const numberartworkurl = `https://localhost:7233/api/artworks/recent-artwork-count`
const nearest7artworkurl = `https://localhost:7233/api/artworks/recent7artworksNotImage`
const artworkbycreatornoimageurl = `https://localhost:7233/api/artworks/ByCreatorIDNotImage/`
const recentartworks = 'https://localhost:7233/api/artworks/recent-likes-summary'
const artworkyidnoimageurl = 'https://localhost:7233/api/artworks/ArtworkNotImageFile/'
const artworkPAymentStatus = 'https://localhost:7233/api/artworks/GetArtworksWithPaymentStatus'

export async function GetArtsPaymentStatus(creatorId:string,artworkId:string) {
  try{
      let artwork:ArtworkPaymentStatus = await axios.get(artworkPAymentStatus+`/${creatorId}`+`/${artworkId}`).then(response => response.data)
      return artwork
  }catch(err){
    console.log(err)
  }
}

export async function GetArtsNoImageByCreatorId(id:string) {
  try{
      let artwork:Artwork[] = await axios.get(artworkbycreatornoimageurl+id).then(response => response.data)
      return artwork
  }catch(err){
    console.log(err)
  }
}

export async function GetRecentArtListLikeCount() {
  try{
      let artList:Artwork[] = await axios.get(recentartworks).then(response => response.data)
      return artList
      
  }catch(err){
    console.log(err)
  }
}

export async function GetArtListCount() {
  try{
      let artList:number = await axios.get(numberartworkurl).then(response => response.data)
      return artList
      
  }catch(err){
    console.log(err)
  }
}

export async function GetRecent7ArtList() {
  try{
      let artList:Artwork[] = await axios.get(nearest7artworkurl).then(response => response.data)
      return artList
      
  }catch(err){
    console.log(err)
  }
}

export async function GetArtList() {
        try{
            let artList:Artwork[] = await axios.get(arturl).then(response => response.data)
            return artList
            
        }catch(err){
          console.log(err)
        }
}

export async function GetTop10Arts() {
  try{
      let artList:Artwork[] = await axios.get(top10arturl).then(response => response.data)
      return artList
      
  }catch(err){
    console.log(err)
  }
}

export async function GetRandom10Arts() {
  try{
      let artList:Artwork[] = await axios.get(random10arturl).then(response => response.data)
      return artList
      
  }catch(err){
    console.log(err)
  }
}

export async function GetArtsByCreatorId(id:string) {
  try{
      let artwork:Artwork[] = await axios.get(artworkbycreatorurl+id).then(response => response.data)
      return artwork
  }catch(err){
    console.log(err)
  }
}

export async function GetArtById(id:string) {
  try{
      let artwork:Artwork = await axios.get(arturl+id).then(response => response.data)
      return artwork
  }catch(err){
    console.log(err)
  }
}

export async function GetArtByIdNoImage(id:string) {
  try{
      let artwork:Artwork = await axios.get(artworkyidnoimageurl+id).then(response => response.data)
      return artwork
  }catch(err){
    console.log(err)
  }
}