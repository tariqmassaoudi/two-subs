import React, { useState , useEffect,useRef  } from 'react';
import { TextField, InputAdornment, IconButton } from "@material-ui/core";
import { Search } from "@material-ui/icons";

import Snackbar from '@material-ui/core/Snackbar';

import Card from './Card'
const SubSearch = ({bucket
  }) => {
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState("")
    const s3Url='https://'+bucket+'.s3.eu-west-3.amazonaws.com/'

    const isFolder = (folderName)=>{
      if (folderName.endsWith('/')){
        return true
      }else{
        return false
      }
    }
    const buttonRef = useRef(null);

    const [data, setData] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [loading, setLaoding] = useState(false);

    function handleKeyDown(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        buttonRef.current.click();
      }
    }

    const handleInputChange = (event) => {


      setSearchValue(event.target.value);
    };

    const  handleButtonClick = async() => {
      setLaoding(true)
         const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "searchstring":  searchValue,"bucket":bucket})
      };
      const response = await fetch('https://lqrqvmhcdf.execute-api.eu-west-3.amazonaws.com/default/getAnimeSubs',requestOptions);
      const json = await response.json();
      console.log(json)
      setData(json);
      setLaoding(false)
     
    }

    const  handleDownload = async(item) => {
      console.log(s3Url+item.name)

      const response = await fetch(s3Url+item.name);
      const data = await response.blob();
      
      // Create a URL for the data object
      const url = URL.createObjectURL(data);
      
      // Create an anchor element and set its attributes
      const a = document.createElement('a');
      a.setAttribute('download', item.name.split('/')[item.name.split('/').length-1]);
      a.setAttribute('href', url);
      
      // Programmatically click on the anchor element to initiate the download
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
     
    }
  

    // async function handleInputChange(event) {
    
   
    // }

    async function handleClick(e,item) {
      
      if(isFolder(item.name)){
        setLaoding(true)
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ "folderToSearch": item.name,"bucket":bucket})
        };
        const response = await fetch('https://lqrqvmhcdf.execute-api.eu-west-3.amazonaws.com/default/getAnimeSubs',requestOptions);
        const json = await response.json();
        console.log(json)
        setData(json)
        setLaoding(false)
      
      }
      
     
    }

     function handleLoadSub(item,index) {
      
      
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {message: "uploadFileFromLink"+index, itemName:item.name,bucket:bucket}, function(response) {
            console.log(response);
          });
        });
      
      setOpen(true)
      setMessage('Subtitle loaded succesfully on track ' + index)
     
    }
    useEffect(() => {
      async function fetchData() {
        setLaoding(true)
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ "searchstring": 'Nar',"bucket":bucket})
        };
        const response = await fetch('https://lqrqvmhcdf.execute-api.eu-west-3.amazonaws.com/default/getAnimeSubs',requestOptions);
        const json = await response.json();
        console.log('showing json')
        console.log(json)
        setData(json);
        setLaoding(false)
      }
      fetchData();
    }, []);


// let res=app.getSubtitles('', 'Interstellar.mp4', 'en', 'TemporaryUserAgent')
// console.log(res)

  
    return (
     <div>

<TextField style={{ width: "100%" }}
      label="Search Anime"
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton ref={buttonRef} onClick={()=> handleButtonClick()}>
              <Search />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
      {/* <TextField label="Search Anime"  onChange={handleInputChange}/> */}
      <Snackbar
  open={open}
  autoHideDuration={500}
  message={message}
/>
      <Card data={data} handleClick={handleClick} loading={loading} handleDownload={handleDownload} handleLoadSub={handleLoadSub}/>
    </div>
    );
  };
  
  export default SubSearch;
  