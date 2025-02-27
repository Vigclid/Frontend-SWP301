import "../../css/SearchResultsList.css";
import { SearchResultUser } from "./SearchResultUser";
import { SearchResultsArtWork } from "./SearchResultArtWork";
import { SearchResultTag } from "./SearchResultTag";
import { GetArtworkByTagname } from "../../API/ArtworkAPI/GET.tsx";
import { useState, useEffect } from "react";

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

export const SearchResultsList = (props) => {
  const { dataCreator = [], dataArt = [], dataTag = [] } = props;

  console.log("dataArt received in SearchResultsList:", dataArt);
  const creatorsToShow = getRandomThree(dataCreator); // 3 creators ngẫu nhiên
  const artToShow = getRandomThree(dataArt); // 3 artworks ngẫu nhiên
  const [tagsWithArtwork, setTagsWithArtwork] = useState([]);

  useEffect(() => {
    const fetchTagsArtwork = async () => {
      try {
        if (dataTag.length > 0) {
          const tagsToShow = getRandomThree(dataTag); // 3 tags ngẫu nhiên
          const tagsData = await Promise.all(
              tagsToShow.map(async (tag) => {
                const artworks = await GetArtworkByTagname(tag.tagName);
                // Lấy tối đa 3 artworks cho mỗi tag
                return { ...tag, artworks: artworks.slice(0, 3) };
              })
          );
          setTagsWithArtwork(tagsData);
        } else {
          setTagsWithArtwork([]);
        }
      } catch (error) {
        console.error("Error fetching artworks for tags:", error);
      }
    };
    fetchTagsArtwork();
  }, [dataTag]);

  return (
      <div className="results-list">
        {/* Hiển thị tối đa 3 creators */}
        {creatorsToShow.map((creator) => (
            <SearchResultUser
                key={creator.accountId}
                result={
                    creator.account?.userName ||
                    `${creator.lastName} ${creator.firstName}`
                }
                resultId={creator.accountId}
                resultIdkey={creator.accountId}
            />
        ))}

        {/* Hiển thị tối đa 3 artworks */}
        {artToShow.map((art) => (
            <SearchResultsArtWork
                key={art.artworkID}
                result={art.artworkName}
                resultId={art.artworkID}
                resultIdkey={art.artworkID}
            />
        ))}

        {/* Hiển thị tối đa 3 tags, mỗi tag tối đa 3 artworks */}
        {tagsWithArtwork.map((tag) => (
            <div key={tag.tagName || tag.tagIndex}>
              <h3>{tag.tagName}</h3>
              {tag.artworks && tag.artworks.length > 0 ? (
                  tag.artworks.map((art) => (
                      <SearchResultsArtWork
                          key={art.artworkID}
                          result={art.artworkName}
                          resultId={art.artworkID}
                          resultIdkey={art.artworkID}
                      />
                  ))
              ) : (
                  <p>No artworks found for this tag</p>
              )}
            </div>
        ))}
      </div>
  );
};