import React from 'react';
import Navbar from '../containers/navbar/Navbar';
import Footer from '../containers/footer/Footer';
import CreateAndManageChild from '../parentsComponent/CreateAndManageChild';

const CreateAndManageChildPage = () => {
    return (
        <>
            <Navbar />
            <CreateAndManageChild />
            <Footer />
        </>
    );
};

export default CreateAndManageChildPage;
