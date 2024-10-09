import React from 'react';
import Navbar from '../containers/navbar/Navbar';
import Footer from '../containers/footer/Footer';
import StorytellingGame from '../childUser/StorytellingGame';

const StorytellingGamePage = () => {
  return (
    <>
      <Navbar />
      <StorytellingGame />  
      <Footer />
    </>
  );
};

export default StorytellingGamePage;
