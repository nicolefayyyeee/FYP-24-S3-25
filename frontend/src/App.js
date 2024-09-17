import React from 'react'
import Navbar from './containers/navbar/Navbar';
import Header from './containers/header/Header';
import About from './containers/about/About';
import Features from './containers/features/Features'
import FAQ from './containers/faq/FAQ';
import Footer from './containers/footer/Footer';
import ChildHome from './childUser/ChildHomePage';

function App() {
  return (
    <>
      <Navbar />
      <Header />
      <Features />
      <About />
      <FAQ />
      <Footer />
    </>
  );
}

export default App;
