import React from 'react'
import Typography from '@mui/material/Typography'


export default function Unauthorized() {
  return (
    <div style={{display:'flex',flexDirection:'column',justifyContent:'center'}}>
    <Typography variant="h1" color="initial">Unauthorized!</Typography>
    <img style={{width:'30%'}} src="/images/baka.jpg" alt="baka" />
    </div>
  )
}
