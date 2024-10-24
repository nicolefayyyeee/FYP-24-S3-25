// AvatarBuilder.js
import React from 'react';
import Navbar from '../containers/navbar/Navbar';
import AvatarComponent from '../containers/avatar/Avatar';
import Footer from '../containers/footer/Footer';

const AvatarBuilder = () => {
  return (
    <>
      <Navbar />
      <AvatarComponent />
      <Footer />
    </>
  );
};

export default AvatarBuilder;
