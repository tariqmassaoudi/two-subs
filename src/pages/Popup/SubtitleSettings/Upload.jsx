import React, { useState } from 'react';
import { styled } from '@material-ui/core/styles';
import PublishIcon from '@material-ui/icons/Publish';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';

const InvisibleInput = styled('input')({
  display: 'none',
});

const RedButton = withStyles({
  root: {
    backgroundColor: 'red',
    '&:hover': {
      backgroundColor: 'darkred',
    },
  },
})(Button);

const Upload = ({ popup, setMenu, buttonName, eventName,invisibleInputName,index}) => {
  const [listening, setListening] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [fileName, setfileName] = useState('');


  
  chrome.storage.sync.get(null, function (storage) {
    console.log('storage is ')
    console.log(storage)
    if (storage['fileName'+index] !== undefined) {
      setLoaded(true);
      setfileName(storage['fileName'+index])
    }
  
  })
  // invisibleInputName

  function invisibleUploadHandler(e) {
    console.log(e)
    const file = e.target.files[0];
    const fileUpload = new CustomEvent(eventName, { detail: file });
   
    document.dispatchEvent(fileUpload);

    setMenu(false);
  }

  function uploadButtonHandler() {
 
      chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
        chrome.tabs.sendMessage(tab[0].id, { fileUpload: invisibleInputName });
      });
 
 
     
    
  }

  function handleClick() {
    if(index=='1'){

      chrome.storage.sync.remove('fileName1')
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {message: "clear1"}, function(response) {
          console.log(response);
        });
      });
    }else{
      chrome.storage.sync.remove('fileName2')
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {message: "clear2"}, function(response) {
          console.log(response);
        });
      });
    }
    setLoaded(false);
  }
   
    
  


  console.log("Im inside upload element loggin listenning then popup")
  console.log(listening)
  console.log(popup)
  if (!popup && !listening) {
    setListening(true);
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.fileUpload==invisibleInputName) {
        document.getElementById(invisibleInputName).click();
      }
    });
  }


  chrome.runtime.onMessage.addListener((msg) => {

      if(index=='1'){
        if(msg.fileName1){
          chrome.storage.sync.set({
            fileName1:msg.fileName1
          }
          
);

      }else{

        chrome.storage.sync.set({
          fileName2:msg.fileName2
        })
        
      }
    
    
    }
    
   
  });

  // return (
    <div></div>
    {if (loaded){
      return ( <Box mb={4} mt={2}>
        <Grid container justify="center" my={8}>
      
      <RedButton
            onClick={()=>handleClick()}
            variant="contained"
            color="secondary"
            endIcon={<DeleteIcon />}
          >
            {fileName}
          </RedButton>
          </Grid>
      </Box>)
    }else{
      return (<Box mb={4} mt={2}>
        <Grid container justify="center" my={8}>
          <InvisibleInput
            onChange={invisibleUploadHandler}
            type="file"
            id={invisibleInputName}
          />
          <Button
            onClick={uploadButtonHandler}
            variant="contained"
            color="secondary"
            endIcon={<PublishIcon />}
            style={{ backgroundColor: blue[500] }}
          >
            {buttonName}
          </Button>
        </Grid>
      </Box>)
    }
  
  }
    
  // );
};

export default Upload;
