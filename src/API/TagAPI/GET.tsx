import { Tag } from '../../Interfaces/TagInterface'
import axios from 'axios'


const tagurl = `${process.env.REACT_APP_API_URL}/Tag/`
const tagsbyarturl = `${process.env.REACT_APP_API_URL}/artworks/`
export async function GetTagList() {
        try{
            let tagList:Tag[] = await axios.get(tagurl).then(response => response.data)
            return tagList
            
        }catch(err){
          console.log(err)
        }
}
export async function GetTagById(id:string) {
    try{
        let tag:Tag = await axios.get(tagurl+id).then(response => response.data)
        return tag
        
    }catch(err){
      console.log(err)
    }
}

export async function GetTagByArtId(id:string) {
  try{
      let tag:Tag[] = await axios.get(tagsbyarturl+id+"/tags").then(response => response.data)
      return tag
      
  }catch(err){
    console.log(err)
  }
}