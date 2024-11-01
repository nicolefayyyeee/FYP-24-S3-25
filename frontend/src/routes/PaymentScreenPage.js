import React from 'react';
import Navbar from '../containers/navbar/Navbar';
import Footer from '../containers/footer/Footer';
import PaymentScreen from '../parentsComponent/PaymentScreen';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentScreenPage = () => {
    return (
        <>
            <Navbar />
            <Elements stripe={stripePromise}>
                <PaymentScreen />
            </Elements>
            <Footer />
        </>
    );
};

export default PaymentScreenPage;
