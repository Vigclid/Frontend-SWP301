import React, { useContext, useState, useRef, useEffect } from "react";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import { SearchResultsList } from "../Users/SearchResultsList.jsx";
import axios from "axios";
import { getAccountByAccountId } from "../../API/AccountAPI/GET.tsx";
import { GetArtworkByTagName } from "../../API/ArtworkAPI/GET.tsx";
import debounce from "lodash/debounce";


const SearchDarkMode = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.25)",
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
    },
    "& .results-list": {
        position: "absolute",
        top: "100%",
        left: 0,
        width: "100%",
        background: "#333",
        zIndex: 1000,
        maxHeight: "300px",
        overflowY: "auto",
    },
}));

const SearchLightMode = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "rgba(169, 169, 169, 0.15)",
    "&:hover": {
        backgroundColor: "rgba(169, 169, 169, 0.25)",
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
    },
    "& .results-list": {
        position: "absolute",
        top: "100%",
        left: 0,
        width: "100%",
        background: "#fff",
        zIndex: 1000,
        maxHeight: "300px",
        overflowY: "auto",
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
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
            width: "20ch",
            "&:focus": {
                width: "50ch",
            },
        },
    },
}));

export default function CustomizedSearchBar() {
    const { dark } = useContext(ThemeContext);

    const [input, setInput] = useState("");
    const [dataCreator, setDataCreator] = useState([]);
    const [dataArt, setDataArt] = useState([]);
    const [dataTag, setDataTag] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null); // Ref để theo dõi thanh tìm kiếm

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
            const filteredResults = creatorsWithAccount.filter(
                ({ account, firstName, lastName }) => {
                    if (!value) return false;
                    const searchValue = value.toLowerCase();
                    return (
                        account?.userName?.toLowerCase().includes(searchValue) ||
                        firstName?.toLowerCase().includes(searchValue) ||
                        lastName?.toLowerCase().includes(searchValue)
                    );
                }
            );
            setDataCreator(filteredResults);
            console.log("Creators filtered:", filteredResults);
        } catch (error) {
            console.error("Error fetching creator data:", error);
        }
    };

    const fetchArt = async (value) => {
        try {
            const response = await axios.get(`http://localhost:7233/api/artworks/`);
            if (!value) {
                setDataArt([]);
                return;
            }
            const searchValue = value.toLowerCase();
            const filteredResults = response.data.filter((art) =>
                art?.artworkName?.toLowerCase().includes(searchValue)
            );
            setDataArt(filteredResults);
            console.log(`Art filtered with "${value}":`, filteredResults);
        } catch (error) {
            console.error("Error fetching art data:", error);
        }
    };

    const fetchTag = async (value) => {
        try {
            const response = await axios.get(`http://localhost:7233/api/Tag/`);
            const tags = response.data;
            const filteredTags = tags.filter((tag) =>
                value && tag?.tagName?.toLowerCase().includes(value.toLowerCase())
            );
            const tagsWithArtwork = await Promise.all(
                filteredTags.map(async (tag) => {
                    const artworks = await GetArtworkByTagName(tag.tagName);
                    return { ...tag, artworks: artworks.slice(0,3) }
                })
            );
            setDataTag(tagsWithArtwork);
            console.log("Tags filtered:", tagsWithArtwork);
        } catch (error) {
            console.error("Error fetching tag data:", error);
        }
    };

    const debouncedSearch = debounce((value) => {
        if (value.trim() === "") {
            setDataCreator([]);
            setDataArt([]);
            setDataTag([]);
            setShowResults(false);
        } else {
            fetchCreator(value);
            fetchArt(value);
            fetchTag(value);
            setShowResults(true);
        }
    }, 300);

    const handleChange = (value) => {
        setInput(value);
        debouncedSearch(value);
    };
    const handleSelectResult = () => {
        // Reset khi chọn một kết quả
        setInput(""); // Reset input về rỗng
        setShowResults(false); // Ẩn kết quả tìm kiếm
    };

    const handleClickOutside = (event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
            // Click ra ngoài thanh tìm kiếm
            setInput(""); // Reset input về rỗng
            setShowResults(false); // Ẩn kết quả tìm kiếm
        }
    };

    useEffect(() => {
        // Thêm event listener khi component mount
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Xóa event listener khi component unmount
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const SearchWrapper = dark ? SearchDarkMode : SearchLightMode;

    return (
        <SearchWrapper ref={searchRef}>
            <SearchIconWrapper>
                <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
                placeholder="Search..."
                inputProps={{ "aria-label": "search" }}
                value={input}
                onChange={(e) => handleChange(e.target.value)}
            />
            {showResults &&
                (dataCreator.length > 0 || dataArt.length > 0 || dataTag.length > 0) && (
                    <SearchResultsList
                        dataCreator={dataCreator}
                        dataArt={dataArt}
                        dataTag={dataTag}
                        onSelect={handleSelectResult} // Truyền callback để reset khi chọn
                    />
                )}
        </SearchWrapper>
    );
}