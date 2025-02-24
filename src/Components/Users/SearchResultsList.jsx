import "../../css/SearchResultsList.css";
import { SearchResultUser } from "./SearchResultUser";
import { Link } from "react-router-dom";
// import { SearchResultTag } from './SearchResultTag';
import { SearchResultsArtWork } from "./SearchResultArtWork";
import { SearchResultTag } from "./SearchResultTag";
import { getAccountByAccountId } from "../../API/AccountAPI/GET.tsx";

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
  const tagsToShow = getRandomThree(dataTag);

  return (
    <div className="results-list">
      {creatorsToShow.map((creator, id) => {
        const account = getAccountByAccountId(creator.AccountId);
        return (
          <>
            <SearchResultUser
              key={id}
              result={account.userName}
              resultId={creator.creatorID}
              resultIdkey={id}
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

      {tagsToShow.map((tag, id) => {
        return (
          <SearchResultTag
            key={id}
            result={tag.tagName}
            resultId={tag.tagID}
            resultIdkey={id}
          />
        );
      })}
    </div>
  );
};
