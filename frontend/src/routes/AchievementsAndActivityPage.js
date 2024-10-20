import React from 'react';
import Navbar from '../containers/navbar/Navbar';
import Footer from '../containers/footer/Footer';
import AchievementsAndActivity from '../parentsComponent/AchievementsAndActivity';

const AchievementsAndActivityPage = () => {
    return (
        <>
            <Navbar />
            <AchievementsAndActivity />
            <Footer />
        </>
    );
};

export default AchievementsAndActivityPage;
