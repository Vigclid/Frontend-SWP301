import React, { useContext, useEffect, useState } from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../Themes/ThemeProvider.tsx';
import CustomizedDrawer from '../StyledMUI/CustomizedDrawer.tsx';
import AppLogo from '../StyledMUI/AppLogo.jsx';
import ExpandingSearchBar from '../StyledMUI/CustomizedSearchBar.jsx'
import CustomizedDropdown from '../StyledMUI/CustomizedDropdown.tsx';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import LoginForm from '../Forms/LoginForm.jsx';
import { useHandleClick } from '../../CustomHooks/HandleClick.jsx';
import { GetCreatorByID } from '../../API/UserAPI/GET.tsx';
import { Creator } from '../../Interfaces/UserInterface';
import "../../css/Package.css"
import PremiumTypography from '../StyledMUI/PremiumTypography.tsx';
import {  } from '../../API/PackageAPI/GET.tsx';
import { CurrentPackage } from '../../Interfaces/Package.ts';
import ChipDepositeCoin from '../StyledMUI/ChipDepositeCoin.tsx';

export default function Menu() {
  const { theme } = useContext(ThemeContext);
  // Attempt to retrieve the auth state from sessionStorage
  const savedAuth = sessionStorage.getItem('auth');
  // Check if there's any auth data saved and parse it
  const user: Creator = savedAuth ? JSON.parse(savedAuth) : null;
  // Now 'auth' contains your authentication state or null if there's nothing saved

  const [isOpen, handleClick] = useHandleClick()
  const [avatar, setAvatar] = useState<Creator>()
  const [pack,setPack] = useState<CurrentPackage>()
  

  useEffect(() => {
    const getAvatar = async () => {
      // const avatar = await GetCreatorByID(user ? user.CreatorId : '0')
      // setAvatar(avatar)
    }
    const getPackage = async () => {
      // const pack = await GetCurrentPackageByCreatorID(user ? user.CreatorId : '0')
      // setPack(pack)
    }
    if (user !== null) {
      getAvatar();
      getPackage()
    }

  }, [])
  const disabledButtons = () => {

  }

  function LoginButton() {
    return (
      <Link to={"/"}> <h3 style={{ fontWeight: 'normal' }}>Login</h3></Link>
    )
  }
  return (
    <div>
      <Popper open={isOpen ? true : false} transition>
        {({ TransitionProps, placement }) => (
          <Fade {...TransitionProps} >
            <Box>
              <LoginForm handleClick={handleClick} backdrop={"backdrop"} disableOutsideClick={undefined} alternative={undefined} />
            </Box>
          </Fade>
        )}
      </Popper>
      <Box sx={{ flexGrow: 1, boxShadow: '50px' }}>
        <AppBar sx={{ transition: theme.transition, color: theme.color, backgroundColor: theme.backgroundColor }} position="static">
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomizedDrawer />
              <AppLogo />
              <ExpandingSearchBar />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Link to={`package`}>
                <Button>
                  <PremiumTypography pack={pack} />
                </Button>
              </Link>
              {user === null ? <LoginButton /> : ""}
              <Button onClick={user === null ? () => handleClick : () => disabledButtons()}
                color="inherit"><Link to={user !== null ? "artworkform" : ""}>
                  <h3 style={{ fontWeight: 'normal' }}>
                    Publish Your Works
                  </h3>
                </Link>
              </Button>
              <Link to={`depositecoin`}>
                <Button>
                  <ChipDepositeCoin user={ user}  />
                </Button>
              </Link>
              <CustomizedDropdown
                handleClickAsGuest={handleClick}
                user={ user} 
                pack = {pack??null}
                />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  )
}
