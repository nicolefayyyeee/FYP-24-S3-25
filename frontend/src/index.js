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
import AdminUploadImg from './routes/AdminUploadPage'
import ChildExplorePage from './routes/ChildExplorePage'
import ManageAccountsPage from './routes/ManageAccountsPage';
import ManageUserProfilesPage from './routes/ManageUserProfilesPage';
import CreateAdminPage from './routes/CreateAdminPage';
import CreateProfilePage from './routes/CreateProfilePage';
import ViewAllAccountsPage from './routes/ViewAllAccountsPage';
import ViewAllProfilesPage from './routes/ViewAllProfilesPage';
// import ViewAllReviewsPage from './routes/ViewAllReviewsPage';
// import SearchAccountPage from './routes/SearchAccountPage';
// import SearchProfilePage from './routes/SearchProfilePage';

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
      <Route path='/adminUpload' element={<AdminUploadImg />} />
      <Route path='/explorePage' element={<ChildExplorePage />} />
      <Route path='/manageAccounts' element={<ManageAccountsPage/>} />
      <Route path='/manageUserProfiles' element={<ManageUserProfilesPage/>} />
      <Route path='/createAdmin' element={<CreateAdminPage/>} />
      <Route path='/createProfile' element={<CreateProfilePage/>} />
      <Route path='/viewAllAccounts' element={<ViewAllAccountsPage/>} />
      <Route path='/viewAllProfiles' element={<ViewAllProfilesPage/>} />
      {/* <Route path='/viewAllReviews' element={<ViewAllReviewsPage/>} /> 
      <Route path='/searchAccount' element={<SearchAccountPage/>} />
      <Route path='/searchProfile' element={<SearchProfilePage/>} />  */}
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);
