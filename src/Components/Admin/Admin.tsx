import { useEffect, useState } from 'react'
import { Container, Box, Typography, Paper } from '@mui/material';
import AdminNavbar from './NavigationAd.jsx';
import MyLineChart from './Charts/LineChart.jsx';
import '../../css/Admin.css';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Avatar from '@mui/material/Avatar';
import { Doughnut } from 'react-chartjs-2';
import PeopleIcon from '@mui/icons-material/People';
import CircularProgress from '@mui/material/CircularProgress';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend, ArcElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { GetArtListCount, GetRecent7ArtList, GetRecentArtListLikeCount } from '../../API/ArtworkAPI/GET.tsx';
import { GetCreatorListCount, GetCreatorListNoImage } from '../../API/UserAPI/GET.tsx';
import { Creator } from '../../Interfaces/UserInterface.ts';
import { Artwork } from '../../Interfaces/ArtworkInterfaces.ts';


export default function Admin() {
  const [artcount, setArtCount] = useState<number>()
  const [creatorcount, setCreatorCount] = useState<Creator[]>()
  const [nearest7arts, setNearest7Arts] = useState<Artwork[]>()
  const [creatorlist, setCreatorList] = useState<Creator[]>()
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const getArtworkCount = async () => {
      let artCount = await GetArtListCount()
      setArtCount(artCount)
    }
    const getCreatorCount = async () => {
      let creatorCount = await GetCreatorListCount()
      setCreatorCount(creatorCount)
    }

    const getNearest7Arts = async () => {
      setLoading(true)
      let nearest7arts = await GetRecentArtListLikeCount()
      setLoading(false)
      setNearest7Arts(nearest7arts??[])
    }
    const getCreatorDetails = async () => {
      let creatorDetails = await GetCreatorListNoImage()
      setCreatorList(creatorDetails??[])
    }
    getCreatorDetails()
    getNearest7Arts()
    getArtworkCount()
    getCreatorCount()
  }, [])


  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  ChartJS.register(ArcElement, Tooltip, Legend);
  const options = {

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
        text: `Statistics on recent of artwork's performace`,
        font: {
          size: 20,
        },

      },
    },
    scales: {
      x: {
        grid: {
          color: '#ECECEC', // Màu của đường lưới trục X
          lineWidth: 1, // Độ dày của đường lưới trục X
        },
        ticks: {
          // color: 'theme.color2', // Màu của nhãn trục X
          max: 10, // Số lượng thanh trục X
        },
      },
      y: {
        grid: {
          color: '#ECECEC', // Màu của đường lưới trục Y
          lineWidth: 1, // Độ dày của đường lưới trục Y
        },
        ticks: {
          // color: 'black', // Màu của nhãn trục Y
          max: 10, // Số lượng thanh trục Y
        },
      },
    },
  };
  const uservip = creatorlist?.filter(user => user.vip === true).length;
  const usernonvip = creatorlist? (creatorlist.length - uservip??0):(0);
  const data2 = {
    labels: ['Non-VIP Users', 'VIP Users'],
    datasets: [
      {
        label: '# of Votes',
        data: [usernonvip, uservip],
        backgroundColor: [
          'rgb(46, 144, 250)',
          'rgb(251, 156, 12)',

        ],
        borderColor: [
          'rgb(46, 144, 250)',
          'rgb(251, 156, 12)',

        ],
        borderWidth: 1,
      },
    ],
  };
  const options2 = {
    responsive: true,
    cutoutPercentage: 70,
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            size: 15,
          },
        },
      },
      title: {
        // color:'black',
        display: true,
        text: 'Users statistics diagram ',
        font: {
          size: 20,
        },
      },
    },
  };
  // sơ đồ 1
  const labels = nearest7arts ? nearest7arts.map(art => art.artworkID) : []
  const likesList = nearest7arts ? nearest7arts.map(art => art.likes) : []
  const data = {
    labels,
    datasets: [
      {
        label: 'Number Of Likes On Recent Artworks',
        data: likesList,
        backgroundColor: 'rgb(46, 144, 250)',
        boderColor: 'black',// Màu của cột chính
        boderWidth: '1'
      },

    ],
  };



  return (
    <>
      <AdminNavbar />
      <Container style={{ width: "60vw" }}>
        <Box my={4} >
          <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold' }}>
            Overview
          </Typography>
          {/* Other sections will go here */}
          <div className='total'>
            <Box className='infortotal'>
              <Avatar sx={{ width: 70, height: 70, backgroundColor: '#ed8e00' }}
                style={{ margin: 'auto 20px' }}>
                <AutoAwesomeIcon sx={{ width: 40, height: 40, }} />
              </Avatar>
              <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold', color: '#666666', margin: 'auto 10px' }}>
                Total Artwork:
              </Typography>
              <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold', color: '#666666', margin: 'auto 10px' }}>
                {artcount}
              </Typography>

            </Box>
            <Box className='infortotal'>
              <Avatar sx={{ width: 70, height: 70, backgroundColor: '#15b79f' }}
                style={{ margin: 'auto 20px' }}>
                <PeopleIcon sx={{ width: 40, height: 40, }} />
              </Avatar>
              <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold', color: '#666666', margin: 'auto 10px' }}>
                Total Users: {creatorcount?.length}
              </Typography>
            </Box>

          </div>

          {/* biểu đồ người dùng và biểu đồ art */}
          <div className='allchart'>
            {loading===true ?
              <CircularProgress
                color='primary'
                size={100}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '40%',
                }}
              />
              : ""}
            <Box className='boxchart'>
              <div className='chart' style={{ width: '700px', margin: 'auto', padding: '25px' }}>
                <Bar options={options} data={data} />
              </div>
              <div className='nameworks-container'>
                {nearest7arts?.map((work, index) => (
                  <div className='namework' key={index}>
                    {work.artworkID}: {work.artworkName}
                    {/* {work.date} */}
                  </div>
                ))}
              </div>
            </Box>


            <Box className='boxdoughnut'>
              <div className='doughnut' style={{ width: '350px' }}>
                <h4>Total Users:{creatorcount?.length}</h4>
                <Doughnut options={options2} data={data2} />
              </div>
            </Box>
          </div>


        </Box>
      </Container>
    </>
  )
}
