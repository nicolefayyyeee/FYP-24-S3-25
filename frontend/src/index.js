import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import {BrowserRouter, Routes, Route} from 'react-router-dom'

import OurApp from './routes/OurAppPage'
import AboutPage from './routes/AboutPage'
import ContactPage from './routes/ContactPage'
import LoginPage from './routes/LoginPage'
import ImageCaptionPage from "./routes/ImageCaptionPage";
import ProfilePage from './routes/ProfilePage'
import AdminHomePage from './routes/AdminHomePage';
import ParentHomePage from './routes/ParentHomePage';
import ChildHomePage from './routes/ChildHomePage';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='/ourApp' element={<OurApp />} />
      <Route path='/about' element={<AboutPage />} />
      <Route path='/contact' element={<ContactPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path="/imageCaption" element={<ImageCaptionPage />} />
      <Route path='/profile' element={<ProfilePage />} />
      <Route path='/adminhome' element={<AdminHomePage />} />
      <Route path='/parenthome' element={<ParentHomePage />} />
      <Route path='/childhome' element={<ChildHomePage />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);