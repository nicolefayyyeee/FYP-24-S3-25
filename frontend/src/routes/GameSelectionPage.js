import React from 'react';
import Navbar from '../containers/navbar/Navbar';
import Footer from '../containers/footer/Footer';
import GameSelection from '../childUser/GameSelection'; 

const GameSelectionPage = () => {
  return (
    <>
      <Navbar />
      <GameSelection />
      <Footer />
    </>
  );
};

export default GameSelectionPage;
