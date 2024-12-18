import React from 'react'
import Navbar from './containers/navbar/Navbar';
import Header from './containers/header/Header';
import About from './containers/about/About';
import Features from './containers/features/Features'
import FAQ from './containers/faq/FAQ';
import Contact from './containers/contact/Contact';
import Footer from './containers/footer/Footer';

function App() {
  return (
    <>
      <Navbar />
      <Header />
      <Features />
      <About />
      <FAQ />
      <Contact />
      <Footer />
    </>
  );
}

export default App;
