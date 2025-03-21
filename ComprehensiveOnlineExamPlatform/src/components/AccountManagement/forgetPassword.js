import React, { useState, useContext } from "react";
import { Typography, TextField, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Alert } from "@mui/material";
import PropTypes from "prop-types";
import axios from 'axios';
import { AppContext } from '../AppContext';
  
function ForgetPassword() {
  const { userAccountDemo, demoMode } = useContext(AppContext);

  // State for open/close the dialog
  const [open, setOpen] = useState(false);
  
  // State for storing user input
  const [forgetPassword1, setForgetPassword1] = useState("");
  const [forgetPassword2, setForgetPassword2] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [matchUser, setMatchUser] = useState({});  

  // State to store the randomly generated reset code
  const [randomNo, setRandomNo] = useState("");

  // State for error or success message
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  // State to track whether the user has passed the first step of verification
  const [resetPasswordState, setResetPasswordState] = useState(false);

  // Function to close the dialog and reset the form
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  // Function to reset form fields
  const resetForm = () => {
    setError("");
    setSuccessMessage("");
    setForgetPassword1("");
    setForgetPassword2("");
    setResetCode("");
    setResetPasswordState(false);
  };


  // Function to validate user input and proceed to the reset step
  const handleContinue = async () => {
    
    if (!forgetPassword1 || !forgetPassword2) {
        setError("Both fields are required!");
        setTimeout(() => setError(""), 3000);
        return;
    }

    try {
        // Check the user name and get the user informations.
        let user;
        if(demoMode){
          if(userAccountDemo.find(user => user.name === forgetPassword1)){
            user = userAccountDemo.find(user => user.name === forgetPassword1)
            setMatchUser(user);
          }else{
            setError("User not found.");
            setTimeout(() => setError(""), 3000);
          }
        }
        else{
          const response = await axios.post("/matchUserInfo", { username: forgetPassword1 });
          user = response.data.matchUser;
          setMatchUser(user); 
        }
        // check the e-mail
        if (user.email === forgetPassword2) {
            // Clear input fields
            setForgetPassword1("");
            setForgetPassword2("");

            // Move to the password reset step
            setResetPasswordState(true);

    // Generate a random 6-digit reset code which assume send to email
            const randomNo = Math.floor(100000 + Math.random() * 900000);
            setRandomNo(randomNo);
            setTimeout(() => {
                alert(`Assume Generated Reset Number: ${randomNo}`);
            }, 500);
        } else {
            // e-mail is not match
            setError("User found, but email does not match.");
            setTimeout(() => setError(""), 3000);
        }
    } catch (error) {
      // user not found or other issues.
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        console.error("reset password error:", error);
      }
      setTimeout(() => setError(""), 3000);
    }
}; 

  // Function to handle password reset process
  const handleReset = async () => {
    if (String(resetCode) !== String(randomNo)) {
      setError("Reset code incorrect");
      setTimeout(() => setError(""), 3000);
      return;
    }
    if (!(forgetPassword1&&forgetPassword2)) {
      setError("Both passwords are required!");
      setTimeout(() => setError(""), 3000);
      return;
    }

  const passwordData = {
      id: matchUser.id,
      newPassword1: forgetPassword1,
      newPassword2: forgetPassword2,
    };
    
  try {
    if (demoMode) {
      const selectedUser = userAccountDemo.find(user => user.id === matchUser.id);
      if (!selectedUser) {
        setError(`User with ID "${matchUser.id}" not found.`);
        setTimeout(() => setError(""), 3000);
        return;
      }
  
      // Verify old password correctness for changing password
      const oldPassword = matchUser.password;
      if(oldPassword){
        const isCorrectnessOldPassword = userAccountDemo.find(user => user.password === oldPassword);
        if (!isCorrectnessOldPassword) {
          setError(`Old password is incorrect.`);
          setTimeout(() => setError(""), 3000);
          return;
        }
      }
  
      // Verify old password if it is the same as old one
      const isSamePassword = userAccountDemo.find(user => user.password === passwordData.newPassword1);
      if (isSamePassword) {
        setError(`New password is the same as the old password`);
        setTimeout(() => setError(""), 3000);
        return;
      }
  
      // Verify two password whether they are the same.
      if (passwordData.newPassword1 !== passwordData.newPassword2) {
        setError(`Two new passwords do not the same.`);
        setTimeout(() => setError(""), 3000);
        return;
      }
      // update the user's password
      userAccountDemo.find(user => user.id === matchUser.id).password = passwordData.newPassword1;
      setSuccessMessage("Password reset successful!");
      setTimeout(() => {
        setSuccessMessage("");
        handleClose();
      }, 3000);
    }
    else{
      const response = await axios.post("/updatePassword", passwordData);
      if(response.status===200){
      setSuccessMessage("Password reset successful!");
      setTimeout(() => {
        setSuccessMessage("");
        handleClose();
     }, 3000);}
    }} catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
       setError(error.response.data.message);
      } else {
        console.error("Error resetting password:", error);
      }
      setTimeout(() => setError(""), 3000);
    }
};
  
  
  return (
    <div>
      {/* Button to open the forget password dialog */}
      <Typography
        variant="body2"
        color="primary"
        sx={{ mt: 2, textAlign: "center", cursor: "pointer" }}
        onClick={() => { setOpen(true); resetForm(); }}
      >
        Forget the password?
      </Typography>
      
      {/* Dialog for password reset */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

          {/* check User name or new password input field */}
          <DialogContentText>
            {resetPasswordState
              ? "Your account information matches. Please input your new password."
              : "Enter your account's username and email address to get reset code."}
          </DialogContentText>
      
          <TextField
            label={resetPasswordState ? "Input New Password" : "User Name"}
            value={forgetPassword1}
            onChange={(e) => setForgetPassword1(e.target.value)}
            style={{ marginTop: "20px" }}
            type={resetPasswordState ? "password" : "text"}
            fullWidth
          />

          <TextField
            label={resetPasswordState ? "Input New Password again" : "E-mail"}
            value={forgetPassword2}
            onChange={(e) => setForgetPassword2(e.target.value)}
            style={{ marginTop: "20px" }}
            type={resetPasswordState ? "password" : "text"}
            fullWidth
          />

          {resetPasswordState && (
            <TextField
              label={"Reset Code"}
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              style={{ marginTop: "20px" }}
              type={"text"}
              fullWidth
            />
          )}
          
          {/* error message or successful message */}
          {error && (<Alert variant="outlined" severity="error">{error}</Alert>)}
          {successMessage && (<Alert variant="outlined" severity="success">{successMessage}</Alert>)}

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={resetPasswordState ? handleReset : handleContinue}>
            {resetPasswordState ? "Reset" : "Continue"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

// Prop validation for component
ForgetPassword.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default ForgetPassword;
