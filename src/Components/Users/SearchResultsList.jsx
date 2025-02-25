import "../../css/SearchResultsList.css";
import { SearchResultUser } from "./SearchResultUser";
import { Link } from "react-router-dom";
import { SearchResultsArtWork } from "./SearchResultArtWork";
import { SearchResultTag } from "./SearchResultTag";
import { getAccountByAccountId } from "../../API/AccountAPI/GET.tsx";
import { GetArtworkByTagname } from "../../API/ArtworkAPI/GET.tsx";
import { useState, useEffect } from "react";

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
  console.log(dataArt);
  const creatorsToShow = getRandomThree(dataCreator);
  const artToShow = getRandomThree(dataArt);
  const [tagsWithArtwork, setTagsWithArtwork] = useState([]);

  useEffect(() => {
    const fetchTagsArtwork = async () => {
      try {
        if (dataTag.length > 0) {
          // Lấy ngẫu nhiên 3 tag từ dataTag (bạn có thể thay đổi nếu cần)
          const tagsToShow = getRandomThree(dataTag);
          const tagsData = await Promise.all(
            tagsToShow.map(async (tag) => {
              const artworks = await GetArtworkByTagname(tag.tagName);
              return { ...tag, artworks };
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
      {creatorsToShow.map((creator) => {
        return (
          <>
            <SearchResultUser
              key={creator.accountId} // sử dụng accountId làm key
              result={
                creator.account?.userName ||
                `${creator.lastName} ${creator.firstName}`
              }
              resultId={creator.accountId}
              resultIdkey={creator.accountId} // hoặc một giá trị duy nhất khác
            />
          </>
        );
      })}
      {artToShow.map((art, id) => {
        return (
          <>
            <SearchResultsArtWork
              key={id}
              result={art.artworkName}
              resultId={art.artworkID}
              resultIdkey={id}
            />
          </>
        );
      })}
      {tagsWithArtwork.map((tag, index) => {
        return (
          <div key={index} className="tag-group">
            <div className="artwork-list">
              {tag.artworks &&
                tag.artworks
                  .slice(0, 3)
                  .map((art, artIndex) => (
                    <SearchResultsArtWork
                      key={artIndex}
                      result={art.artworkName}
                      resultId={art.artworkID}
                      resultIdkey={artIndex}
                    />
                  ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
