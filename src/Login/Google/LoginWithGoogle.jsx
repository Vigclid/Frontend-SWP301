import React, { useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import GoogleIcon from '@mui/icons-material/Google';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../Components/AuthenContext.tsx';
import { PostCreator, PostUserAccount } from '../../API/UserAPI/POST.tsx';


export default function LoginWithGoogle({ disableOutsideClick, handleClick }) {
  const accounturl = 'http://localhost:7233/api/Account'
  const creatorurl = 'http://localhost:7233/api/Creator/'
  const roleurl = 'http://localhost:7233/api/Role/'

  const { storeUserData } = useAuth();
  //Call the custom hook to store user login information
  const navigate = useNavigate();

  //This Method will able you to fetch Google Authentication Token and use Google API to fetch user gmail account info without needing a Backend
  const googleAPI = 'https://www.googleapis.com/oauth2/v3/userinfo' // URL to googleapis to authenticate user token
  const onClick = useGoogleLogin({
    onSuccess: async response => {
      console.log(response);
      const token = (response.access_token);
      //Using Axios to fetch API from Google
      //Async await to synchonize fetching data
      //TODO: Remove console.log when finish testing
     const ggAccount = await axios.get(googleAPI, { headers: { Authorization: `Bearer ${token}` } }).then(response => response.data)
     const listOfAccounts = await axios.get(accounturl).then(response => response.data)
     const foundAccount = listOfAccounts.find((account) => account.email === ggAccount.email);
     
     if (foundAccount)  {
         //Get the user roles
      const userroleResponse = await axios.get(roleurl+foundAccount.roleID);
      const userrole = userroleResponse.data;
      //Store the user role in sesison
      (userrole.roleName === "Admin") ? sessionStorage.setItem('userRole', "AD") 
                                      : sessionStorage.setItem('userRole', userrole.roleName);
       // Once the user is verified, get additional user data.
      const creatorResponse = await axios.get(creatorurl + foundAccount.accountId);
      const creatorData = creatorResponse.data;
      const creatorWithoutTheImages = {
        ...creatorData,
        'email' : foundAccount.email
      }
      storeUserData(creatorWithoutTheImages);
        window.dispatchEvent(new Event('userLoggedIn'));
        if (sessionStorage.getItem('userRole') === "AD") {
          navigate('/admin');
        } else {
          navigate('/characters');
        }
      } else {
         let account= {
                accountId: "0",
                roleID: "2", 
                email: ggAccount.email,
                password: "",
                status: false
              }
              let creator = {
                CreatorId: "0",
                accountId: "0",
                coins: 0,
                userName: "",
                profilePicture: "",
                backgroundPicture: "",
                firstName: "",
                lastName: undefined,
                address: undefined,
                phone: undefined,
                lastLogDate: undefined,
                CreateAt:  undefined,
                DateOfBirth: undefined,
                biography: undefined,
                allowCommission: undefined,
                followCount: 0,
                followerCount: 0,
                email: ggAccount.email,
                RankID: 1,
                RoleID: 2
              }

         let newAccount = await PostUserAccount(account)
         let creatorWithAccountID = { ...creator, accountID: newAccount ? newAccount.accountId : "1" }
         await PostCreator(creatorWithAccountID)
         
         const listOfAccounts = await axios.get(accounturl).then(response => response.data)
         const foundAccount = listOfAccounts.find((account) => account.email === ggAccount.email);   
          sessionStorage.setItem('userRole', "Users");
          // Once the user is verified, get additional user data.
          const creatorResponse = await axios.get(creatorurl + foundAccount.accountId);
          const creatorData = creatorResponse.data;
          const creatorWithoutTheImages = {
            ...creatorData
          }
          storeUserData(creatorWithoutTheImages);
            window.dispatchEvent(new Event('userLoggedIn'));
            navigate('/characters');


      }

    },
    onError: error => { console.log(error) }
  }, [])
  return (
    <>
      <Button
        onClick={() => onClick()}
        variant="contained"
        startIcon={<GoogleIcon />}
        fullWidth
        sx={{ backgroundColor: '#DB4437', color: 'white' }}
      >
        Login with Google
      </Button>
    </>
  )
}
