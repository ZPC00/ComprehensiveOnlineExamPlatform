import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Paper from '@mui/material/Paper';
import { useContext } from 'react';
import { AppContext } from './AppContext';
import LinearProgress from '@mui/material/LinearProgress';
import { Alert, Button, Box } from '@mui/material';
import HomePage from './HomePage';

export default function Content() {
  // import global variables for change display page
  const { functs, setUsername, setDemoMode, demoMode, isloading, setfuncts } = useContext(AppContext);

  const handleChangeDemo = () => {
      setDemoMode(false);
      setUsername('');
      setfuncts(<HomePage/>)
  };

  
  return (
    <Paper sx={{ maxWidth: 1300, margin: 'auto', overflow: 'hidden' }}>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
      >
      {/* Demo mode displaying and exit demo button.*/}
      <div>
      {demoMode && (
        <Box display="flex" alignItems="center" gap={2} sx={{ backgroundColor: '#E1F5FE' }}>
          <Alert severity="info" sx={{ flexGrow: 1 }}>
            In demo mode, the data is demo data, independent and not saved! refresh or click exit demo button to exit demo mode.
          </Alert>
          <Button onClick={handleChangeDemo} variant="contained" color="primary">
            Exit Demo
          </Button>
        </Box>
      )}
    </div>

      {/* change display page */}
      {isloading? (
        <>
        <LinearProgress/>
      <h3>Due to the limitations of free users of the onrender platform, it will take more loading time on first visiting, please wait...</h3> 
      </>
      ) :  (
        // change display page.
        <div style={{padding: '10px 20px'}}>
        {functs}
      </div>
      )
    }
    </AppBar>
    </Paper>
  );
}
