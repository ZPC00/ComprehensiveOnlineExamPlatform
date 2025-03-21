import React, { useContext } from 'react';
import { Button } from '@mui/material';
import { AppContext } from './AppContext';

const HomePage = () => {
  const { demoMode, setDemoMode, username } = useContext(AppContext);

  const handleChangeDemo = () => {
    setDemoMode(true)
  };

  return (
    <div
      style={{
          backgroundImage: "url(public/HomePage.jpg)",
          backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative"
      }}
    >
     {!demoMode && !username && (<Button 
        variant="contained" 
        onClick={handleChangeDemo} 
        sx={{ 
          padding: "15px 30px", 
          fontSize: "18px", 
          border: "none", 
          borderRadius: "5px",
          position: "absolute", 
          bottom: "32%" 
        }}
      >
        Start Demo
      </Button>)}
    </div>
  );
};

export default HomePage;
