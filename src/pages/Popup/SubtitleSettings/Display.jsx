import React, { useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import MenuHeading from '../MenuHeading';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';


const Display = ({ popup, eventName }) => {
  const [isChecked, setIsChecked] = useState(false);
  console.log("loading "+ eventName)
  const [listening, setListening] = useState(false);

  chrome.storage.sync.get(null, function (storage) {
    if(eventName=='displaySettings1'){
      if(storage.show1!== undefined){
        setIsChecked(!storage.show1)
      }
    }
    
    
    else{
      if(storage.show2!== undefined){
        setIsChecked(!storage.show2)
      }
    }})

  const handleCheckboxChange = (event) => {
   
    if (event.target.checked){
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {message: "hide"+eventName.charAt(eventName.length - 1)}, function(response) {
          console.log(response);
        });})
    }else{
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {message: "show"+eventName.charAt(eventName.length - 1)}, function(response) {
          console.log(response);
        });})
    }
    

      setIsChecked(event.target.checked);
   
  };
  function displaySettingsHandler(action) {
    console.log(eventName)
    console.log("popup is "+popup)
    if (popup) {
      console.log("inside popup if")
      // Send message to content script (this file but content script)
      chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
        chrome.tabs.sendMessage(tab[0].id, { displaySettings: action+eventName });
      });
    } else {
      console.log("inside dispatch event")
      // Dispatch event
      const displaySettings = new CustomEvent(eventName, {detail: action});
      document.dispatchEvent(displaySettings);

    }
  }

  if (!listening) {
    console.log("popup is "+popup)
    setListening(true);
    if (!popup) {
      // Listening for messages from the popup (this file but popup)
      chrome.runtime.onMessage.addListener((msg) => {
        if (msg.displaySettings) {
          displaySettingsHandler(msg.displaySettings.replace(eventName,''));
          console.log("index inside listening condition is "+eventName)
        }
      });
    }
  }
const handleDisable=()=>{
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {message: "hide"+eventName.charAt(eventName.length - 1)}, function(response) {
      console.log(response);
    });
  });
  
}
  return (
    <>
      <MenuHeading heading="Display:" />
      <Box mb={1}>
        <List component="nav" aria-label="main mailbox folders">
         
        
      <ListItem button>
            <ListItemText style={{ color: 'black' }} primary="Hide" />
            <ListItemSecondaryAction>
            
      <Checkbox
        checked={isChecked}
        onChange={handleCheckboxChange}
        inputProps={{ 'aria-label': 'primary checkbox' }}
      />
            </ListItemSecondaryAction>
          </ListItem>
    
          <ListItem button>
            <ListItemText style={{ color: 'black' }} primary="Font Size" />
            <ListItemSecondaryAction>
              <IconButton
                onClick={() => displaySettingsHandler('font-smaller')}
                edge="end"
                aria-label="font-smaller"
              >
                <RemoveCircleIcon />
              </IconButton>
              <IconButton
                onClick={() => displaySettingsHandler('font-bigger')}
                edge="end"
                aria-label="font-bigger"
              >
                <AddCircleIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem button>
            <ListItemText style={{ color: 'black' }} primary="Background" />
            <ListItemSecondaryAction>
              <IconButton
                onClick={() => displaySettingsHandler('opacity-minus')}
                edge="end"
                aria-label="opacity-minus"
              >
                <RemoveCircleIcon />
              </IconButton>
              <IconButton
                onClick={() => displaySettingsHandler('opacity-plus')}
                edge="end"
                aria-label="opacity-plus"
              >
                <AddCircleIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Box>
    </>
  );
};

export default Display;
