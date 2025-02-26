import React, { useContext, useState } from "react";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import { SearchResultsList } from "../Users/SearchResultsList.jsx";
import axios from "axios";
import Account from "../../Interfaces/UserInterface.ts";
import { getAccountByAccountId } from "../../API/AccountAPI/GET.tsx";
import { Box } from "@mui/material";
import { GetArtworkByTagname } from "../../API/ArtworkAPI/GET.tsx";

const SearchDarkMode = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "rgba(255, 255, 255, 0.15)", // Use 'rgba' for white with opacity
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.25)", // Increase opacity on hover
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchLightMode = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "rgba(169, 169, 169, 0.15)", // Use 'rgba' for white with opacity
  "&:hover": {
    backgroundColor: "rgba(169, 169, 169, 0.25)", // Increase opacity on hover
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // Vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
      "&:focus": {
        width: "50ch", // Expanded width on focus
      },
    },
  },
}));

export default function ExpandingSearchBar() {
  const { dark } = useContext(ThemeContext);

  // // dung de search user

  const [input, setInput] = useState("");
  const [dataCreator, setDataCreator] = useState("");
  const [dataArt, setDataArt] = useState("");
  const [dataTag, setDataTag] = useState("");
  // const [showResults, setShowResults] = useState(false); // Trạng thái để kiểm soát việc hiển thị kết quả tìm kiếm

  const fetchCreator = async (value) => {
    try {
      const response = await axios.get(`http://localhost:7233/api/Creator`);
      const creators = response.data;

      const creatorsWithAccount = await Promise.all(
          creators.map(async (creator) => {
            const account = await getAccountByAccountId(creator.accountId);
            return { ...creator, account };
          })
      );
      const filteredResults = creatorsWithAccount.filter(({ account }) => {
        return (
            value &&
            account &&
            account.userName &&
            account.userName.toLowerCase().includes(value.toLowerCase())
        );
      });

      setDataCreator(filteredResults);
      console.log(filteredResults);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchArt = (value) => {
    axios
        .get(`http://localhost:7233/api/artworks/`)
        .then((response) => {
          // console.log(response);
          const filteredResults = response.data.filter((art) => {
            return (
                value &&
                art &&
                art.artworkName &&
                art.artworkName.toLowerCase().includes(value.toLowerCase())
            );
          });
          // console.log(filteredResults);
          setDataArt(filteredResults);
          // setShowResults(true);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
  };

  const fetchTag = async (value) => {
    try {
      const response = await axios.get(`http://localhost:7233/api/Tag/`);
      const tags = response.data; // tags là một mảng tag

      // Lọc tag theo tên chứa giá trị search (value)
      const filteredTags = tags.filter((tag) => {
        return (
            value &&
            tag &&
            tag.tagName &&
            tag.tagName.toLowerCase().includes(value.toLowerCase())
        );
      });

      // Nếu bạn cần lấy thông tin artwork cho mỗi tag, bạn có thể sử dụng Promise.all
      // Lưu ý: Chỉ fetch artwork nếu cần dùng cho chuyển hướng hay hiển thị sau
      const tagsWithArtwork = await Promise.all(
          filteredTags.map(async (tag) => {
            const artworks = await GetArtworkByTagname(tag.tagName);
            return { ...tag, artworks }; // lưu cả mảng artwork vào tag
          })
      );

      // Cập nhật state với danh sách tag có kèm artwork (nếu cần)
      setDataTag(tagsWithArtwork);
    } catch (error) {
      console.error("Error fetching tag data:", error);
    }
  };

  const handleChange = (value) => {
    setInput(value);
    fetchCreator(value);
    fetchArt(value);
    fetchTag(value);
  };

  // const [input2, setInput2] = useState("");
  // const [results2, setResults2] = useState([]);
  // // const [showResults, setShowResults] = useState(false); // Trạng thái để kiểm soát việc hiển thị kết quả tìm kiếm

  // const fetchData2 = (value) => {
  //     console.log(1);
  //     axios.get(`https://localhost:7233/api/artworks`)
  //         .then(response => {
  //             // console.log(response);
  //             const filteredResults = response.data.filter(artwork => {
  //                 return (
  //                     value &&
  //                     artwork &&
  //                     artwork.userName &&
  //                     artwork.userName.toLowerCase().includes(value.toLowerCase())
  //                 );
  //             });
  //             setResults(filteredResults);
  //             // setShowResults(true);

  //         })
  //         .catch(error => {
  //             console.error('Error fetching data:', error);
  //         });

  // }
  // const handleChange = (value) => {
  //     setInput(value);
  //     fetchData(value);

  //   };

  //    // SEARCH HOME
  //     const [input, setInput] = useState("");
  //     const [results, setResults] = useState([]);
  //     // const [showResults, setShowResults] = useState(false); // Trạng thái để kiểm soát việc hiển thị kết quả tìm kiếm

  //     const fetchData = (value) => {
  //         console.log(1);
  //         axios.get(`https://localhost:7233/api/Creator/Search/`)

  //                 .then(response => {
  //                     const creators = response.data.creators.filter(creators => {
  //                         return (
  //                             value &&
  //                             creators &&
  //                             creators.userName &&
  //                             creators.userName.toLowerCase().includes(value.toLowerCase())
  //                         );
  //                     });

  //                     const artworksByArtworkName = response.data.artworksByArtworkName.filter(artworksByArtworkName => {
  //                         return (
  //                             value &&
  //                             artworksByArtworkName &&
  //                             artworksByArtworkName.artworkName &&
  //                             artworksByArtworkName.artworkName.toLowerCase().includes(value.toLowerCase())
  //                         );
  //                     });

  //                     const combinedResults = [...creators, ...artworksByArtworkName];
  //                     setResults(combinedResults);
  //                 })

  //             .catch(error => {
  //                 console.error('Error fetching data:', error);
  //             });

  //     }
  //     const handleChange = (value) => {
  //         setInput(value);
  //         fetchData(value);

  //       };

  // const handleChange = (value) => {
  //     setInput(value);
  //     if (value.trim() === "") {
  //         setShowResults(false);
  //     } else {
  //         fetchData(value);
  //     }
  // };
  // const handleBlur = () => {
  //     // Ẩn kết quả tìm kiếm khi người dùng nhấp ra khỏi ô tìm kiếm, trừ khi đã bắt đầu nhập lại vào ô
  //     // if (input.trim() === "") {
  //         setShowResults(false);

  // };
  // const handleFocus = () => {
  //     // Hiển thị kết quả tìm kiếm khi người dùng nhấp vào ô tìm kiếm
  //     if (input.trim() !== "") {
  //         setShowResults(true);
  //     }
  // };
  const searchBarComponent = (
      // <Box onBlur={handleBlur}
      // onFocus={handleFocus}>
      <>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
            placeholder="Search..."
            inputProps={{ "aria-label": "search" }}
            value={input}
            onChange={(e) => handleChange(e.target.value)}
            //  onBlur={handleBlur}
            // onFocus={handleFocus}>
        />
        {/* bo cho nay */}

        {/* // {showResults && results && results.length > 0 && <SearchResultsList results={results} />} */}
        {/* // </Box> */}
      </>
  );
  const lightMode = <SearchLightMode>{searchBarComponent}</SearchLightMode>;
  const darkMode = <SearchDarkMode>{searchBarComponent}</SearchDarkMode>;

  return (
      // dark? darkMode : lightMode
      <div>
        {dark ? (
            <SearchDarkMode>
              {searchBarComponent}
              {dataCreator && dataCreator.length > 0 && (
                  <SearchResultsList
                      dataCreator={dataCreator}
                      dataArt={dataArt}
                      dataTag={dataTag}
                  />
              )}
            </SearchDarkMode>
        ) : (
            <SearchLightMode>
              {searchBarComponent}
              {dataCreator && dataCreator.length > 0 && (
                  <SearchResultsList
                      dataCreator={dataCreator}
                      dataArt={dataArt}
                      dataTag={dataTag}
                  />
              )}
            </SearchLightMode>
        )}
      </div>

      //     <div>
      //     {dark ? (
      //         <SearchDarkMode>
      //             {searchBarComponent}
      //             {/* {showResults && results && results.length > 0 && <SearchResultsList results={results} />} */}
      //         </SearchDarkMode>
      //     ) : (
      //         <SearchLightMode>
      //             {searchBarComponent}
      //             {/* {showResults && results && results.length > 0 && <SearchResultsList results={results} />} */}
      //         </SearchLightMode>
      //     )}
      // </div>
  );
}