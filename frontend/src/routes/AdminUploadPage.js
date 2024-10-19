import React from 'react';
import AdminUploadImg from '../adminUser/AdminUploadImg'; // Ensure this points to the correct component
import Navbar from '../containers/navbar/Navbar';
import Footer from '../containers/footer/Footer';

const GalleryPage = () => {
    return (
        <>
            <Navbar />
            <AdminUploadImg /> 
            <Footer />
        </>
    );
};

export default GalleryPage;
