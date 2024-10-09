import React from 'react';
import Navbar from '../containers/navbar/Navbar'; 
import Footer from '../containers/footer/Footer';  
import MatchPictureGame from '../childUser/MatchPictureGame';  

function MatchPictureGamePage() {
  return (
    <>
      <Navbar /> 
      <MatchPictureGame />  
      <Footer />
    </>
  );
}

export default MatchPictureGamePage;
