import React from 'react';
import ChildGallery from '../childUser/ChildGallery'; // Ensure this points to the correct component
import Navbar from '../containers/navbar/Navbar';
import Footer from '../containers/footer/Footer';

const GalleryPage = () => {
    return (
        <>
            <Navbar />
            <ChildGallery /> 
            <Footer />
        </>
    );
};

export default GalleryPage;
