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
import GameSelectionPage from './routes/GameSelectionPage';
import MatchPictureGamePage from './routes/MatchPictureGamePage'; 
import StorytellingGamePage from './routes/StorytellingGamePage';
import GalleryPage from './routes/galleryPage';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='/ourApp' element={<OurApp />} />
      <Route path='/about' element={<AboutPage />} />
      <Route path='/contact' element={<ContactPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path="/imageCaptioning" element={<ImageCaptionPage />} />
      <Route path='/profile' element={<ProfilePage />} />
      <Route path='/adminhome' element={<AdminHomePage />} />
      <Route path='/parenthome' element={<ParentHomePage />} />
      <Route path='/childhome' element={<ChildHomePage />} />
      <Route path="/games" element={<GameSelectionPage />} />
      <Route path="/match-picture" element={<MatchPictureGamePage />} />
      <Route path="/storytelling-game" element={<StorytellingGamePage />} />
      <Route path='/galleryPage' element={<GalleryPage />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);
