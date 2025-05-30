import React from "react";
import {Box, Button, TextField} from "@mui/material"

const forgot=()=>
{
      return (
        <>
          <Box
            component="form"
            sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
            noValidate
            autoComplete="off" className="register">

            <Box className="header_title">Forgot Password</Box>     

            <Box className="forgot">  

           <TextField
           type="email"
           required
           id="email"
           variant="standard"
           label="Enter new password"
        />

         <TextField
          type="password"
          required
           variant="standard"
          id="password"
          label="reset Password"
        />
            
         {/* <Box className="forgot_password">
            <Box className="forgot">Forgot Password</Box>
         </Box> */}
          
          <Button className="primary_button">Enter</Button>
            
         {/* <Box className="account">
            <Box>Already an account</Box>
            <Box className="forgot">Login</Box>
         </Box> */}

          </Box> 
        
        </Box> 
        </>
      )
}

export default forgot;