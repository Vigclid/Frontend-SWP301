import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { CardActionArea, Typography, Box } from "@mui/material"; // Loại bỏ Pagination
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { GetArtworkByTagName } from "../../../API/ArtworkAPI/GET.tsx";
import { PlaceHoldersImageCard } from "../PlaceHolders.jsx";
import { Artwork } from "../../../Interfaces/ArtworkInterfaces"; // Giả sử bạn có interface này
import { ThemeContext } from "../../Themes/ThemeProvider.tsx"; // Giả sử bạn có ThemeProvider

export default function SearchHome({ user }) {
    const { theme } = useContext(ThemeContext); // Lấy theme từ ThemeContext
    const [hoveredID, setHoveredID] = useState(null);
    const [art, setArtwork] = useState([]);
    const { tagName } = useParams();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArt = async () => {
            setLoading(true);
            try {
                const response = await GetArtworkByTagName(tagName);
                setArtwork(Array.isArray(response) ? response : []);
            } catch (error) {
                console.error("Error fetching artworks:", error);
                setArtwork([]);
            } finally {
                setLoading(false);
            }
        };
        if (tagName) {
            fetchArt();
        }
    }, [tagName]);

    function ArtWorkList() {
        return (
            <ImageList variant="masonry" cols={4} className="artwork-grid">
                {art.map((work: Artwork) => (
                    <Link key={work.artworkID} to={`http://localhost:3000/characters/artwork/${work.artworkID}`}>
                        <ImageListItem key={work.artworkID}>
                            {work.purchasable && (
                                <AttachMoneyIcon
                                    style={{
                                        position: "absolute",
                                        backgroundColor: "green",
                                        color: "white",
                                        borderRadius: "50%",
                                        margin: "5px",
                                        fontSize: "40px",
                                        bottom: 0,
                                        right: 0,
                                        zIndex: 2,
                                    }}
                                    fontSize="large"
                                />
                            )}
                            <img
                                style={{ cursor: "pointer" }}
                                src={work.imageFile}
                                alt={work.artworkName}
                                loading="lazy"
                            />
                        </ImageListItem>
                    </Link>
                ))}
            </ImageList>
        );
    }

    return (
        <div className="art-hub-container">
            {/* Main Content */}
            <main className="art-hub-main">

                <div className="seemorecommentwork" style={{ paddingTop: "2%", paddingBottom: "5%" }}>
                    <Box
                        className="box"
                        sx={{
                            color: theme.color,
                            backgroundColor: `rgba(${theme.rgbBackgroundColor}, 0.97)`,
                            transition: theme.transition,
                            width: "95%",
                            margin: "auto",
                            borderRadius: "5px",
                        }}
                    >
                        <div className="content-recomment">
                            <Typography variant="h5">The Artwork By Tag : {tagName}</Typography>
                            <div className="listimage">
                                <Box className="boxlistimage">
                                    {loading ? (
                                        <Typography>Loading...</Typography>
                                    ) : Array.isArray(art) && art.length > 0 ? (
                                        <ArtWorkList />
                                    ) : (
                                        <PlaceHoldersImageCard />
                                    )}
                                </Box>
                            </div>
                        </div>
                    </Box>
                </div>
            </main>
        </div>
    );
}