import "../../css/SearchResultsList.css";
import { SearchResultUser } from "./SearchResultUser";
import { SearchResultsArtWork } from "./SearchResultArtWork";
import { GetArtworkByTagName } from "../../API/ArtworkAPI/GET.tsx";
import {useState, useEffect, useContext,} from "react";
import {ThemeContext} from "../Themes/ThemeProvider.tsx"



// Hàm lấy 3 phần tử ngẫu nhiên (giữ nguyên)
const getRandomThree = (arr) => {
  if (arr.length < 3) return arr;
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, 3);
};

export const SearchResultsList = ({ dataCreator = [], dataArt = [], dataTag = [], onSelect }) => {
  console.log("dataArt received in SearchResultsList:", dataArt);
  const creatorsToShow = getRandomThree(dataCreator); // 3 creators ngẫu nhiên
  const [artFromTags, setArtFromTags] = useState([]); // Lưu trữ tất cả artworks từ các tag
  const artFromDataArtToShow = getRandomThree(dataArt).slice(0, 3); // 1 artwork từ dataArt
  const artFromTagsToShow = getRandomThree(artFromTags).slice(0, 3); // 2 artworks từ tags

  useEffect(() => {
    const fetchArtworksFromTags = async () => {
      try {
        if (dataTag.length > 0) {
          const allArtworksFromTags = [];
          for (const tag of dataTag) {
            const artworks = await GetArtworkByTagName(tag.tagName);
            allArtworksFromTags.push(...(artworks || []));
          }
          // Lấy ngẫu nhiên 3 artworks từ tất cả artworks của các tag
          const randomArtworks = getRandomThree(allArtworksFromTags);
          setArtFromTags(randomArtworks);
        } else {
          setArtFromTags([]);
        }
      } catch (error) {
        console.error("Error fetching artworks for tags:", error);
      }
    };
    fetchArtworksFromTags();
  }, [dataTag]);

  const handleClick = () => {
    if (onSelect) {
      onSelect(); // Gọi callback để reset input trong ExpandingSearchBar
    }
  };

  const {theme} = useContext(ThemeContext);

  return (
      <div className="results-list">
        {/* Hiển thị tối đa 3 creators */}
        <h4 className="titlesearch" style={{color:theme.color6}}>On User</h4>
        {creatorsToShow.map((creator) => (

            <SearchResultUser
                key={creator.accountId}
                result={
                    creator.account?.userName || `${creator.lastName} ${creator.firstName}`
                }
                resultId={creator.accountId}
                resultIdkey={creator.accountId}
            />
        ))}

        {artFromDataArtToShow.length > 0 && (
            <div className="art-group">
              <h4 className="titlesearch" style={{color:theme.color6}}>On Artwork</h4>

              {artFromDataArtToShow.map((art) => (
                  <SearchResultsArtWork
                      key={art.artworkID}
                      result={art.artworkName}
                      resultId={art.artworkID}
                      resultIdkey={art.artworkID}
                      onClick={handleClick}
                  />
              ))}
            </div>
        )}

        {/* Hiển thị artworks từ tags (tối đa 2 artworks) */}

        {artFromTagsToShow.length > 0 && (
            <div className="art-group">
              <h4 className="titlesearch" style={{color:theme.color6}}>On Tag</h4>
              {artFromTagsToShow.map((art) => (
                  <SearchResultsArtWork
                      key={art.artworkID}
                      result={art.artworkName}
                      resultId={art.artworkID}
                      resultIdkey={art.artworkID}
                      onClick={handleClick}
                  />
              ))}
            </div>
        )}
      </div>
  );
};