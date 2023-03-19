
import React from 'react';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import {Typography, Tooltip } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ClosedCaptionIcon from '@material-ui/icons/ClosedCaption';
import ListItemText from '@material-ui/core/ListItemText';
import FolderIcon from '@material-ui/icons/Folder';
import Button from '@material-ui/core/Button';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import ClosedCaption from '@material-ui/icons/ClosedCaption';



export default function Card({data,handleClick,loading,handleDownload,handleLoadSub}) {

    const isFolder = (folderName)=>{
      if (folderName.endsWith('/')){
        return true
      }else{
        return false
      }
    }



    if(loading){
      return (
      <div style={{ display: "flex", justifyContent: "center", height: "100vh" }}>
        <CircularProgress/></div>
      )
    }else{
      return (
        <Paper sx={{ width: 320, maxWidth: '100%' }}>
          <MenuList>
          
    
    {data.map(item => {
      if (isFolder(item.name)){
        return ( <MenuItem>
      <ListItemIcon>
        <FolderIcon />
      </ListItemIcon>
        <ListItemText
        secondary={
          <Typography variant="body2">{item.name.split('/')[item.name.split('/').length -2]}</Typography>
        }
        
        onClick={(e)=> handleClick(e,item)}></ListItemText>
    
      </MenuItem>)
      }else{
          return ( <MenuItem >
    
    <ListItemIcon>
        <ClosedCaptionIcon />
      </ListItemIcon>
          <ListItemText  

secondary={
  <Typography variant="body2">{item.name.split('/')[item.name.split('/').length -1]}</Typography>
}
           onClick={(e)=> handleClick(e,item)} ></ListItemText>


<Tooltip title="Download">
          <Button
      variant="contained"
      color="secondary"
      size="small"
      onClick={() => handleDownload(item)}
      startIcon={<CloudDownloadIcon />}
      style={{ backgroundColor: blue[500] }}
    >
      
    </Button>

    </Tooltip>
    <Tooltip title="Load Track 1">
    <Button size="small" variant="contained" color="secondary" onClick={()=>handleLoadSub(item,1)} startIcon={<ClosedCaption />}
    style={{ backgroundColor: blue[500] }}>
    1
    </Button>
    </Tooltip>
    <Tooltip title="Load Track 2">
    <Button    size="small" variant="contained" color="secondary" onClick={()=>handleLoadSub(item,2)} startIcon={<ClosedCaption />} 
    style={{ backgroundColor: blue[500] }}>
    2
    </Button>
    </Tooltip>
        </MenuItem>)
      }
    })
    }
    
          </MenuList>
        </Paper>
      );
    }

}