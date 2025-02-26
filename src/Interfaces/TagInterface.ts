export interface Tag{
    tagID: number,
    tagName: string,
    artworks: [
        {
            artWorkID: number,
        artWorkName: string,
        }
    ]
}