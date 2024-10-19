import React from 'react';
import ChildExplore from '../childUser/ChildExplore'; // Ensure this points to the correct component
import Navbar from '../containers/navbar/Navbar';
import Footer from '../containers/footer/Footer';
import ExplorePage from '../childUser/ChildExplore';

const GalleryPage = () => {
    return (
        <>
            <Navbar />
            <ExplorePage />
            <Footer />
        </>
    );
};

export default GalleryPage;
