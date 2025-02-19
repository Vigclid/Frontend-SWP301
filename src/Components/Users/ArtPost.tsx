
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import CommentIcon from '@mui/icons-material/Comment';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import TestIcon from '../TestIcon.jsx';
import Comments from '../Comments.jsx';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { ListTag } from '../../share/ListofTag.js';
import { ThemeContext } from '../Themes/ThemeProvider.tsx';
import { GetArtById, GetArtsPaymentStatus } from '../../API/ArtworkAPI/GET.tsx';
import { Artwork, ArtworkPaymentStatus, DownloadArtwork } from '../../Interfaces/ArtworkInterfaces.ts';
import { GetCreatorByID } from '../../API/UserAPI/GET.tsx';
import { Creator } from '../../Interfaces/UserInterface.ts';
import Chip from '@mui/material/Chip';
import { Download } from '@mui/icons-material';
import { Button, Divider } from '@mui/material';
import { Tag } from '../../Interfaces/TagInterface.ts';
import { GetTagByArtId } from '../../API/TagAPI/GET.tsx';
import { Watermark } from '../StyledMUI/AppLogo.jsx';
import { Link } from 'react-router-dom';
import { DeleteArtById } from '../../API/ArtworkAPI/DELETE.tsx';
import ArtShopConfirm from './ArtShopConfirm.jsx';
import html2canvas from 'html2canvas';
import ArtShopDialog from './ArtShopDialog.jsx';

export default function PostWork() {
  const colors = ["#82c87e", "#c07ec8", "#c89c7e", "#7E8DC8", "#C07EC8", "#C87E8A"];
  const { theme } = useContext(ThemeContext)
  const { id } = useParams();
  const [artwork, setArtwork] = useState<DownloadArtwork>()
  const [status, setStatus] = useState<ArtworkPaymentStatus>()
  const [creator, setCreator] = useState<Creator>()
  const [tags, setTags] = useState<Tag[]>([])
  const savedAuth = sessionStorage.getItem('auth');
  const savedUser: Creator = savedAuth ? JSON.parse(savedAuth) : null;
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDowload, setOpenDowload] = useState(false);
  const navigate = useNavigate()
  useEffect(() => {
    const getArtWork = async () => {
      setLoading(true)
      const artworkbyid= await GetArtById(id ? id : "1");
      // console.log('artwork by id: '+artworkbyid?.creatorID);
      if (!artworkbyid) {
        setLoading(false);
        return;
      }
      setArtwork({ ...artworkbyid, idDowLoad: '' })
      const paystatus = await GetArtsPaymentStatus(savedUser?.userID, artworkbyid.artworkID)
      setStatus(paystatus)
      const creator = await GetCreatorByID(artworkbyid ? artworkbyid.creatorID : "1")
      // console.log('Creator ID:', artworkbyid.creatorID);
      // console.log('test'+creator);
      setCreator(creator)
      setLoading(false)
    }
    getArtWork()
  }, [id])


  useEffect(() => {
    const getTags = async () => {
      let tags: Tag[] | undefined = await GetTagByArtId(id ? id : "0")
      setTags(tags ? tags : [])
    }
    getTags()
  }, [id])

  const handleClick = () => {
    console.info('You clicked the Chip.');
  };

  const handleOpen = () => {
    setOpen(!open);
  }

  // Handle Download Arkwork
  const handleClose = () => {
    setOpen(false);
    setOpenDowload(false);
  };
  const downloadSectionAsImage = async (elementId) => {
    const element = document.getElementById(elementId);

    if (element) {
      const canvas = await html2canvas(element);
      const imageUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = "image.png";
      link.click();
      handleClose();
    }
  };

  const handleYesClick = async () => {
    await downloadSectionAsImage(artwork?.idDowLoad);
  }

  const handleDownload = async (id: string) => {
    if (!artwork?.artworkID) return; // Nếu artworkID không có, không tiếp tục

    const downloadArtwork: DownloadArtwork = {
      ...artwork,
      idDowLoad: id,
      artworkID: artwork.artworkID ?? "", // Nếu artworkID là undefined, gán một giá trị mặc định
    };

    setArtwork(downloadArtwork);
    setOpenDowload(true);
  };

  const handleDelete = async () => {
    try {
      setLoading(true)
      const response = await DeleteArtById(artwork?.artworkID ?? "")
      console.log(response.data)
      setLoading(false)
      navigate(`/characters/profile/${savedUser?.userID}`)
    } catch (err) {
      console.log(err)
    }
  }
  function formatMoney(amount) {
    amount *= 1000;
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }
  function TagList() {
    return (
      <>
        {tags.map((tag, index) => (
          <div key={tag.tagID} className='tag-item'>
            <Stack direction="row" spacing={1}>
              <Chip label={tag.tagName} variant="filled" onClick={handleClick} style={{ backgroundColor: colors[index % colors.length], marginBottom: '5px', color: 'white' }} />
            </Stack>
          </div>
        ))}
      </>
    )
  }
  return (
    <Box sx={{ paddingTop: '2%' }}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 100 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {openDowload && <ArtShopDialog open={openDowload} handleClose={handleClose} handleYesClick={handleYesClick} />}
      <div className='poswork'
        style={{ backgroundColor: theme.backgroundColor, paddingBottom: '50px', color: theme.color }}
      >
        <div className='info-postwork'>
          {artwork?.purchasable ? <Watermark /> : ""}
          <div className='imgpost' style={{ backgroundColor: theme.hoverBackgroundColor }}>

            <img id={`img-${artwork?.artworkID}`} style={{ pointerEvents: artwork?.purchasable ? "none" : "auto" }} alt={artwork?.artworkName} src={artwork?.imageFile} />

          </div>
          <Divider orientation='vertical' />
          <div className='contentpost'>
            <div className='infor-user-post'>
              <div className='avatar-user-post'>
                <Stack direction="row" spacing={2}>
                  <Avatar src={creator?.profilePicture}
                    sx={{ width: 50, height: 50 }} />
                </Stack></div>
                <div className='name-user-post'> {creator?.firstName +' '+ creator?.lastName}</div>
            </div>
            <div className='content-post-img'>
              <div>Name: {artwork?.artworkName}</div>
              <div>Description: {artwork?.description}</div>
              <h4 style={{ marginBottom: '5px', marginTop: '10px' }}>Tag:</h4>
              <div className='tag-container'>
                {tags.length !== 0 ? <TagList /> : ""}
              </div>
            </div >
          </div >
        </div >
        <Box className="comment-section" >
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '60%' }}>
            <TestIcon />
            <div className='button-comment'>
              <a href="#comment" style={{ display: "flex" }}>
                <CommentIcon sx={{ color: theme.color, fontSize: 35, marginRight: '5px' }} />
                <h4 style={{ paddingTop: "5px" }} className='addfavourite'>Comment</h4>
              </a>
            </div>
            {creator?.userID === savedUser?.userID ?
              <Button onClick={handleDelete} variant='contained' color='error' >Delete Artwork</Button>
              :
              <div style={{ margin: 'auto 5px', }}>
                {artwork?.purchasable === true && status?.status === false ?
                  <Chip label={formatMoney(artwork?.price)} onClick={handleOpen} style={{ fontSize: '20px', padding: '20px', fontWeight: '600', backgroundColor: '#61dafb' }} />
                  :
                  <Button sx={{ minWidth: '30%', marginBottom: '5px' }}
                    variant="contained" size="small" title='Dowload' onClick={() => handleDownload(`img-${artwork?.artworkID}`)}
                    endIcon={<Download />}
                  >
                    Download Artwork
                  </Button>
                }
              </div>
            }

          </div>
          <div id='"#comment"'>
            <Comments />
          </div>
        </Box>
      </div >
      {open && (<ArtShopConfirm open={open} handleClose={handleOpen} item={artwork ?? null} />)}
    </Box >
  )
}

