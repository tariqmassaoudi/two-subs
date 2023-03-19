import React from 'react';
import Upload from './Upload';
import Display from './Display';
import Sync from './Sync';



const SubtitleSettings = ({ popup, setMenu, index}) => {

console.log(index)
  return (
    <>
    

      <Upload popup={popup} setMenu={setMenu} buttonName={"Load Subtitles "+index} eventName={'fileUpload'+index}  invisibleInputName={'movie-subtitles-file-upload'+index} loaded={false} fileLoaded={null} index={index}/>     
      <Display popup={popup} eventName={'displaySettings'+index} />
      <Sync popup={popup} index={index} />



      
    </>
  );
};

export default SubtitleSettings;
