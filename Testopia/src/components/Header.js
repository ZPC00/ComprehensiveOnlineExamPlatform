import * as React from 'react';
import PropTypes from 'prop-types';
import { AppBar, Grid, IconButton, Link, Toolbar, Tooltip } from '@mui/material';
import { Menu as MenuIcon, Notifications as NotificationsIcon } from '@mui/icons-material';
import { useContext } from 'react';
import { AppContext } from './AppContext';
import Account from './AccountManagement/Account';

const lightColor = 'rgba(255, 255, 255, 0.7)';

function Header(props) {
  const { onDrawerToggle } = props;

  // Context for user account and functs
  const { currentUserInfor } = useContext(AppContext);


  return (
    <React.Fragment>

      {/* Top navigation bar */}
      <AppBar color="primary" position="sticky" elevation={0}>
        <Toolbar>
          <Grid container spacing={1} sx={{ alignItems: 'center' }}>
            <Grid sx={{ display: { sm: 'none', xs: 'block' } }} item>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={onDrawerToggle}
                edge="start"
              >
                <MenuIcon />
              </IconButton>
            </Grid>

          {/* Documentation link */}
          <Grid item xs />
            <Grid item>
            {currentUserInfor.Loginrole==="Teacher"&&(
              <Link
                href="/files/QuestionUploadTemplate.xlsx"
                variant="body2"
                sx={{
                  textDecoration: 'none',
                  color: lightColor,
                  '&:hover': {
                    color: 'common.white',
                  },
                }}
                rel="noopener noreferrer"
                target="_blank"
              >
                Questions Upload Template
              </Link>)}
            </Grid>

          {/* Notifications icon */}
          <Grid item>
              <Tooltip title="Alerts • No alerts">
                <IconButton color="inherit">
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>
          </Grid>

            <Grid item>
              <Account/>
            </Grid>
            
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar
        component="div"
        color="primary"
        position="static"
        elevation={0}
        sx={{ zIndex: 0 }}
      >
      </AppBar>
    </React.Fragment>
  );
}

Header.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired,
};

export default Header;
