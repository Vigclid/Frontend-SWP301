import React, { useEffect, useState } from "react";
import { Container, Box, Typography, Paper } from "@mui/material";
import AdminNavbar from "./NavigationAd.jsx";
import "../../css/Admin.css";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import Avatar from "@mui/material/Avatar";
import { Doughnut } from "react-chartjs-2";
import PeopleIcon from "@mui/icons-material/People";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartData,
  DoughnutController,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { GetArtListCount, GetRecent7ArtList, GetRecentArtListLikeCount } from "../../API/ArtworkAPI/GET.tsx";
import { GetCreatorListCount, GetCreatorListNoImage } from "../../API/UserAPI/GET.tsx";
import { GetNumberOfArtwork, GetNumberOfUser, GetListUser } from "../../API/AdminAPI/GET.tsx";
import { Creator } from "../../Interfaces/UserInterface.ts";
import { Artwork } from "../../Interfaces/ArtworkInterfaces.ts";

export default function Admin() {
  const [artcount, setArtCount] = useState<number>();
  const [creatorcount, setCreatorCount] = useState<number>();
  const [nearest7arts, setNearest7Arts] = useState<Artwork[]>();
  const [creatorlist, setCreatorList] = useState<Creator[]>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getArtworkCount = async () => {
      let artCount = await GetNumberOfArtwork();
      setArtCount(artCount);
    };
    const getCreatorCount = async () => {
      let creatorCount = await GetNumberOfUser();
      setCreatorCount(creatorCount);
    };

    const getNearest7Arts = async () => {
      setLoading(true);
      try {
        const response = await GetRecentArtListLikeCount();
        // Ensure we have valid artwork objects with required fields
        const sanitizedResponse = Array.isArray(response)
          ? response.map((art) => ({
              ...art,
              artworkID: String(art?.artworkID || ""),
              artworkName: String(art?.artworkName || ""),
              likes: Number(art?.likes || 0),
            }))
          : [];
        setNearest7Arts(sanitizedResponse);
      } catch (error) {
        console.error("Error fetching artwork:", error);
        setNearest7Arts([]);
      } finally {
        setLoading(false);
      }
    };

    const getCreatorDetails = async () => {
      let creatorDetails = await GetListUser();
      setCreatorList(creatorDetails ?? []);
    };
    getCreatorDetails();
    getNearest7Arts();
    getArtworkCount();
    getCreatorCount();
  }, []);

  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, DoughnutController);

  const [hiddenDatasets, setHiddenDatasets] = useState<number[]>([]);

  const options: {
    responsive: boolean;
    plugins: {
      legend: {
        display: boolean;
        labels: {
          font: {
            size: number;
          };
        };
      };
      title: {
        display: boolean;
        text: string;
        font: {
          size: number;
        };
      };
    };
    scales: {
      x: {
        type: "category";
        grid: {
          color: string;
          lineWidth: number;
        };
        ticks: {
          maxRotation: number;
        };
      };
      y: {
        type: "linear";
        grid: {
          color: string;
          lineWidth: number;
        };
        beginAtZero: boolean;
      };
    };
  } = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            size: 18,
          },
        },
      },
      title: {
        display: true,
        text: `Statistics on recent artwork performance`,
        font: {
          size: 20,
        },
      },
    },
    scales: {
      x: {
        type: "category",
        grid: {
          color: "#ECECEC",
          lineWidth: 1,
        },
        ticks: {
          maxRotation: 45,
        },
      },
      y: {
        type: "linear",
        grid: {
          color: "#ECECEC",
          lineWidth: 1,
        },
        beginAtZero: true,
      },
    },
  };

  const userMember = creatorlist?.filter((user) => user.nameOfRank?.toLowerCase() === "member").length || 0;
  const userArtisan = creatorlist?.filter((user) => user.nameOfRank?.toLowerCase() === "artisan").length || 0;
  const userArtovator = creatorlist?.filter((user) => user.nameOfRank?.toLowerCase() === "artovator").length || 0;
  const userArtmaster = creatorlist?.filter((user) => user.nameOfRank?.toLowerCase() === "artmaster").length || 0;
  const userArtist = creatorlist?.filter((user) => user.nameOfRank?.toLowerCase() === "artist").length || 0;

  const data2: ChartData<"doughnut"> = {
    labels: ["Member", "Artisan", "Artovator", "Artmaster", "Artist"],
    datasets: [
      {
        label: "Number of Users",
        data: [userMember, userArtisan, userArtovator, userArtmaster, userArtist],
        backgroundColor: [
          "rgb(46, 144, 250)",
          "rgb(251, 156, 12)",
          "rgb(75, 192, 192)",
          "rgb(153, 102, 255)",
          "rgb(255, 99, 132)",
        ],
        borderColor: [
          "rgb(46, 144, 250)",
          "rgb(251, 156, 12)",
          "rgb(75, 192, 192)",
          "rgb(153, 102, 255)",
          "rgb(255, 99, 132)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const [selectedDatasets, setSelectedDatasets] = useState<boolean[]>([true, true, true, true, true]);

  const options2 = {
    responsive: true,
    cutoutPercentage: 70,
    plugins: {
      legend: {
        display: true,
        onClick: function (e: any, legendItem: any, legend: any) {
          const index = legendItem.index;
          const chart = legend.chart;
          const meta = chart.getDatasetMeta(0);

          // Toggle the visibility of the clicked item
          meta.data[index].hidden = !meta.data[index].hidden;

          // Update hiddenDatasets state
          const newHiddenDatasets = [...hiddenDatasets];
          const hiddenIndex = newHiddenDatasets.indexOf(index);
          if (meta.data[index].hidden) {
            if (hiddenIndex === -1) {
              newHiddenDatasets.push(index);
            }
          } else {
            if (hiddenIndex !== -1) {
              newHiddenDatasets.splice(hiddenIndex, 1);
            }
          }
          setHiddenDatasets(newHiddenDatasets);

          // Update center text
          const centerTextElement = document.getElementById("doughnutCenterText");
          if (centerTextElement) {
            const totalVisible = data2.datasets[0].data.reduce((sum, value, i) => {
              return sum + (newHiddenDatasets.includes(i) ? 0 : value);
            }, 0);
            centerTextElement.textContent = `Total Users: ${totalVisible}`;
          }

          chart.update();
        },
        labels: {
          font: {
            size: 15,
          },
          generateLabels: function (chart: any) {
            const datasets = chart.data.datasets;
            return chart.data.labels.map((label: string, i: number) => ({
              text: label,
              fillStyle: datasets[0].backgroundColor[i],
              strokeStyle: datasets[0].borderColor[i],
              lineWidth: 1,
              hidden: hiddenDatasets.includes(i),
              index: i,
              textDecoration: hiddenDatasets.includes(i) ? "line-through" : "",
            }));
          },
        },
      },
      title: {
        display: true,
        text: "User Rank Distribution",
        font: {
          size: 20,
        },
      },
    },
  };

  const getChartData = () => {
    try {
      if (!Array.isArray(nearest7arts)) {
        return {
          labels: [],
          datasets: [
            {
              label: "Number Of Likes On Recent Artworks",
              data: [],
              backgroundColor: "rgb(46, 144, 250)",
              borderColor: "black",
              borderWidth: 1,
            },
          ],
        };
      }

      // Filter out invalid entries and extract data
      const validArts = nearest7arts.filter(
        (art) => art && typeof art === "object" && "artworkID" in art && "likes" in art
      );

      const labels = validArts.map((art) => String(art.artworkID).trim() || "Unknown");
      const likesList = validArts.map((art) => (typeof art.likes === "number" ? art.likes : 0));
      return {
        labels,
        datasets: [
          {
            label: "Number Of Likes On Recent Artworks",
            data: likesList,
            backgroundColor: "rgb(46, 144, 250)",
            borderColor: "black",
            borderWidth: 1,
          },
        ],
      };
    } catch (e) {
      console.error("Error processing chart data:", e);
      return {
        labels: [],
        datasets: [
          {
            label: "Number Of Likes On Recent Artworks",
            data: [],
            backgroundColor: "rgb(46, 144, 250)",
            borderColor: "black",
            borderWidth: 1,
          },
        ],
      };
    }
  };

  const data: ChartData<"bar"> = getChartData();

  return (
    <>
      <AdminNavbar />
      <Container style={{ width: "60vw" }}>
        <Box my={4}>
          <Typography component="div" variant="h4" gutterBottom style={{ fontWeight: "bold" }}>
            {"Overview"}
          </Typography>
          <div className="total">
            <Box className="infortotal">
              <Avatar sx={{ width: 70, height: 70, backgroundColor: "#ed8e00" }} style={{ margin: "auto 20px" }}>
                <AutoAwesomeIcon sx={{ width: 40, height: 40 }} />
              </Avatar>
              <Typography
                component="div"
                variant="h5"
                gutterBottom
                style={{ fontWeight: "bold", color: "#666666", margin: "auto 10px" }}>
                {"Total Artwork:"}
              </Typography>
              <Typography
                component="div"
                variant="h5"
                gutterBottom
                style={{ fontWeight: "bold", color: "#666666", margin: "auto 10px" }}>
                {typeof artcount === "number" ? artcount : 0}
              </Typography>
            </Box>
            <Box className="infortotal">
              <Avatar sx={{ width: 70, height: 70, backgroundColor: "#15b79f" }} style={{ margin: "auto 20px" }}>
                <PeopleIcon sx={{ width: 40, height: 40 }} />
              </Avatar>
              <Typography
                component="div"
                variant="h5"
                gutterBottom
                style={{ fontWeight: "bold", color: "#666666", margin: "auto 10px" }}>
                {`Total Users: ${typeof creatorcount === "number" ? creatorcount : 0}`}
              </Typography>
            </Box>
          </div>

          <div className="allchart">
            {loading === true ? (
              <CircularProgress
                color="primary"
                size={100}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "40%",
                }}
              />
            ) : (
              ""
            )}
            <Box className="boxchart">
              <div className="chart" style={{ width: "700px", margin: "auto", padding: "25px" }}>
                <Bar options={options} data={data} />
              </div>
              <div className="nameworks-container">
                {Array.isArray(nearest7arts) &&
                  nearest7arts.filter(Boolean).map((work, index) => {
                    // Extract and convert values to proper types
                    const id = work?.artworkID ? String(work.artworkID).trim() : "";
                    const name = work?.artworkName ? String(work.artworkName).trim() : "";

                    // Only render if we have valid data
                    if (!id || !name) return null;

                    return (
                      <div className="namework" key={index}>
                        <span>{id}</span>: <span>{name}</span>
                      </div>
                    );
                  })}
              </div>
            </Box>

            <Box className="boxdoughnut">
              <div className="doughnut" style={{ width: "350px", height: "350px" }}>
                <h4 id="doughnutCenterText">{`Total Users: ${creatorcount ?? 0}`}</h4>
                <Doughnut options={options2} data={data2} />
              </div>
            </Box>
          </div>
        </Box>
      </Container>
    </>
  );
}
