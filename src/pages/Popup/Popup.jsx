import React, { useState } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Header from './Header';
import SubtitleSettings from './SubtitleSettings/index';
import Shortcuts from './Shortcuts';
import NoVideoDetected from './NoVideoDetected';
import SubSceneSearch  from './SubSearch';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Grid } from '@material-ui/core';

// tabs functionnality

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}




// For consistency across websites with different global styles
const msTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
  overrides: {
    MuiButton: {
      root: {
        fontSize: '14px !important',
      },
      containedPrimary: {
        backgroundColor: '#ba000d !important',
      },
    },
    MuiButtonBase: {
      root: {
        color: '#000000',
      },
    },
    MuiInputBase: {
      input: {
        fontSize: '16px',
        border: 'none !important',
      },
    },
    MuiContainer: {
      root: {
        paddingLeft: '16px !important',
        paddingRight: '16px !important',
      },
    },
    MuiSvgIcon: {
      root: {
        fontSize: '24px !important',
      },
    },
    MuiTypography: {
      body1: {
        fontSize: '16px !important',
      },
    },
    MuiSwitch: {
      input: {
        position: 'absolute !important',
      },
    },
  },
});

const Popup = ({
  popup,
  setMenu,
  previouslyDetected,
  sitesWithSubtitles,
  thisSite,
}) => {
  const [displayShortcuts, setDisplayShortcuts] = useState(false);
  const [videoDetected, setVideoDetected] = useState(previouslyDetected);
  const [activating, setActivating] = useState(true);


// tabs state management
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (popup && activating) {
    setActivating(false);
    // Send a message to the content script to display the subtitles
    chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
      // Send a new message every 500 milliseconds until the popup closes or a video is detected
      const intervalId = setInterval(() => {
        chrome.tabs.sendMessage(
          tab[0].id,
          { activation: true },
          function (response) {
            // Display an error if no video can be detected
            if (response && !videoDetected) {
              setVideoDetected(true);

              const thisSite = tab[0].url
                .replace(/^.*\/\//, '')
                .replace(/\/.*/, '');

              sitesWithSubtitles.push(thisSite);

              chrome.storage.sync.set(
                {
                  sitesWithSubtitles: sitesWithSubtitles,
                },
                function () {
                  clearInterval(intervalId);
                }
              );
            } else {
              clearInterval(intervalId);
            }
          }
        );
      }, 500);
    });
  }

  return (
    <ThemeProvider theme={msTheme}>
      {displayShortcuts ? (
        <Shortcuts
          setDisplayShortcuts={setDisplayShortcuts}
          thisSite={thisSite}
        />
      ) : (
        <>
          <Header popup={popup} />
          {popup && !videoDetected ? (
            <NoVideoDetected />
          ) : (
           
            <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} >
          <Tab label="Sub Settings" {...a11yProps(0)} />
          <Tab label="Anime Subtitles JP" {...a11yProps(1)} />
          <Tab label="Anime Subtitles ENG" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
      <Grid container spacing={3}>
      <Grid item xs={6}>
      <SubtitleSettings popup={popup} setMenu={setMenu} index={"1"}/>
      </Grid>
      <Grid item xs={6}>
      <SubtitleSettings popup={popup} setMenu={setMenu} index={"2"}/>
      </Grid>
    </Grid>

   

   

      </TabPanel>
      <TabPanel value={value} index={1}>
      
      {/* <SubtitleSettings popup={popup} setMenu={setMenu} index={"2"}/> */}
      <SubSceneSearch bucket={"animesubs"}/>
      </TabPanel>
   

      <TabPanel value={value} index={2}>

      <SubSceneSearch bucket={"animesubseng"}/>

      </TabPanel>
    </Box>
          )}
          
        </>
      )}
    </ThemeProvider>
  );
};

export default Popup;
