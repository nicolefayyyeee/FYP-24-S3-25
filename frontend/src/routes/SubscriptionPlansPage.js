import React from 'react';
import Navbar from '../containers/navbar/Navbar';
import Footer from '../containers/footer/Footer';
import SubscriptionPlans from '../parentsComponent/SubscriptionPlans';

const SubscriptionPlansPage = () => {
    return (
        <>
            <Navbar />
            <SubscriptionPlans />
            <Footer />
        </>
    );
};

export default SubscriptionPlansPage;
