import { Box, Card, Divider } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import "../../css/Package.css"
import { ThemeContext } from '../Themes/ThemeProvider.tsx';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import HomePage from './MainPage/HomePage';
import { CurrentPackage, Package } from '../../Interfaces/Package.ts';
import { GetCurrentPackageByCreatorID, GetPackage } from '../../API/PackageAPI/GET.tsx';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Creator } from '../../Interfaces/UserInterface.ts';
import PackagePaymentConfirm from './PackagePaymentConfirm.tsx';

export default function PackagePage() {
    const { theme, dark } = useContext(ThemeContext)
    const [packageService, SetPackgeService] = useState<Package[]>()
    const [currentPackage, setCurrentPackage] = useState<CurrentPackage>();
    const [loading, setLoading] = useState(false);
    const savedAuth = sessionStorage.getItem('auth');
    // Check if there's any auth data saved and parse it
    const user: Creator = savedAuth ? JSON.parse(savedAuth) : null;
    // Now 'auth' contains your authentication state or null if there's nothing saved
    const [open, setOpen] = useState(false)
    const [selectPackage, setSelectPackage] = useState<Package>()
    useEffect(() => {
        const getPackage = async () => {
            setLoading(true)
            let packageList: Package[] | undefined = await GetPackage()
            SetPackgeService(packageList ?? [])
            let servicePackage: CurrentPackage | undefined = await GetCurrentPackageByCreatorID(user.creatorID)
            setCurrentPackage(servicePackage)
            setLoading(false)
        }
        getPackage()
    }, [])
  const handleOpen = (currentPackage) => {
    setSelectPackage(currentPackage)
    setOpen(!open);
  }

    const currentPack = () => {
        return (
            <Typography sx={{textAlign:"center"}} variant='h5' color="Highlight">Your Current Package</Typography>
        )
    }
    const defaultCardStyle = (packageService: Package) => {
        return (
            <Card className='cardDefault' sx={{ backgroundImage: 'url("/images/default.jpg")' }}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {packageService.packageName}
                    </Typography>
                    <Divider sx={{ borderColor: "grey" }} />
                    <Typography variant="body2" color="text.secondary">
                        {packageService.packageDescription}
                    </Typography>
                    <Divider sx={{ borderColor: "grey" }} />
                    <Typography variant="body2" color="error">
                        Price: {packageService.packagePrice === 0 ? "Free" : packageService.packagePrice}
                    </Typography>
                </CardContent>
                <CardActionArea>
                    <Button disabled={true} className='buyBtn' size="small" color="primary">
                        Default
                    </Button>
                </CardActionArea>
                <CardActions>
                </CardActions>
                {currentPackage?.packageID===1 && currentPack()}
            </Card>
        )
    }
    const premiumCardStyle = (packageService: Package) => {
        return (
            <Card className='cardPremium' sx={{ backgroundImage: 'url("/images/gold.jpg")' }}><CardContent>
                <Typography gutterBottom variant="h5" color="gold" component="div">
                    {packageService.packageName}
                </Typography>
                <Divider sx={{ borderColor: "gold" }} />
                <div>
                    <Typography variant="body2" color="gold">
                        {packageService.packageDescription}
                    </Typography>
                    <Divider sx={{ borderColor: "gold" }} />
                    <Typography variant="body2" color="error">
                        Price: {packageService.packagePrice === 0 ? "Free" : packageService.packagePrice + " VND"}
                    </Typography>
                </div>
            </CardContent>
                <CardActionArea>
                    <Button
                    disabled={currentPackage?.packageID===2}
                        sx={{
                            backgroundColor: "goldenrod", color: "black", border: 'solid 1px', borderLeft: "none", borderRight: "none", borderRadius: '0px'
                            , ":hover": {
                                backgroundColor: "none", color: "gold", border: 'solid 1px goldenrod', borderLeft: "none", borderRight: "none",
                            },
                        }}
                        className='buyBtn' onClick={()=>handleOpen(packageService)} size="small">
                        {currentPackage?.packageID===2?"You're Using This Package":"Purchase"}
                    </Button>
                </CardActionArea>
                <CardActions>
                </CardActions>
                {currentPackage?.packageID===2 && currentPack()}
            </Card>
        )
    }

    return (
        <div className='packagePage'>
            <Box
                sx={{
                    color: theme.color,
                    backgroundColor: `rgba(${theme.rgbBackgroundColor},0.97)`,
                    backgroundImage: dark ? 'url("/images/darkPackage.jpg")' : 'url("/images/lightPackage.jpg")',
                    transition: theme.transition,
                    width: '95%',
                    margin: 'auto',
                    borderRadius: '5px',
                    marginBottom: '15px',
                }}>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 100 }}
                    open={loading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Box sx={{ padding: "2% 2% 0% 2%" }}>
                    <Typography variant='h4' color={theme.color} >Account Packages</Typography>
                    <Divider sx={{ borderColor: theme.color }} />
                </Box>
                <Box className="packageContainer">
                    {packageService?.map((service, index) => {
                        return (
                            index === 0 ? defaultCardStyle(service) :
                                index === 1 ? premiumCardStyle(service) : ""
                        )
                    })}
                </Box>
            </Box>
            <PackagePaymentConfirm open={open} handleClose={handleOpen} item={selectPackage} />
        </div>
    )
}
