import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import {BrowserRouter, Routes, Route} from 'react-router-dom'

// Main Home Pages
import OurApp from './routes/OurAppPage'
import AboutPage from './routes/AboutPage'
import ContactPage from './routes/ContactPage'
import LoginPage from './routes/LoginPage'
import ImageCaptionPage from "./routes/ImageCaptionPage";
import ProfilePage from './routes/ProfilePage'

// Child Pages
import ChildHomePage from './routes/ChildHomePage';
import GameSelectionPage from './routes/GameSelectionPage';
import MatchPictureGamePage from './routes/MatchPictureGamePage'; 
import StorytellingGamePage from './routes/StorytellingGamePage';
import GalleryPage from './routes/galleryPage';
import ChildExplorePage from './routes/ChildExplorePage'
import Avatar from './routes/Avatar'

// Parent Pages
import SubscriptionPlansPage from './routes/SubscriptionPlansPage';
import AchievementsAndActivityPage from './routes/AchievementsAndActivityPage';
import ParentHomePage from './routes/ParentHomePage';
import CreateChildPage from './routes/CreateChildPage';
import EditChildPage from './routes/EditChildPage';
import AddReviewPage from './routes/AddReviewPage';
import MyReviewsPage from './routes/MyReviewsPage';

// Admin Pages
import AdminHomePage from './routes/AdminHomePage';
import AdminUploadImg from './routes/AdminUploadPage'
import ManageAccountsPage from './routes/ManageAccountsPage';
import ManageUserProfilesPage from './routes/ManageUserProfilesPage';
import CreateAdminPage from './routes/CreateAdminPage';
import CreateProfilePage from './routes/CreateProfilePage';
// import EditUserProfilePage from './routes/EditUserProfilePage';
import ViewAllAccountsPage from './routes/ViewAllAccountsPage';
import ViewAllProfilesPage from './routes/ViewAllProfilesPage';
import ViewAllReviewsPage from './routes/ViewAllReviewsPage';

import EditAccountPage from './routes/EditAccountPage';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />

      {/* Main Home Routes */}
      <Route path='/ourApp' element={<OurApp />} />
      <Route path='/about' element={<AboutPage />} />
      <Route path='/contact' element={<ContactPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path="/imageCaptioning" element={<ImageCaptionPage />} />
      <Route path='/profile' element={<ProfilePage />} />
      
      {/* Child Routes */}
      <Route path='/childhome' element={<ChildHomePage />} />
      <Route path="/games" element={<GameSelectionPage />} />
      <Route path="/match-picture" element={<MatchPictureGamePage />} />
      <Route path="/storytelling-game" element={<StorytellingGamePage />} />
      <Route path='/galleryPage' element={<GalleryPage />} />
      <Route path='/explorePage' element={<ChildExplorePage />} />
      <Route path='/avatar' element={<Avatar />} />

      {/* Parent Routes */}
      <Route path='/parenthome' element={<ParentHomePage />} />
      <Route path='/subscriptionPlans' element={<SubscriptionPlansPage/>} />
      <Route path='/achievementsAndActivity' element={<AchievementsAndActivityPage/>} /> 
      <Route path='/createChild' element={<CreateChildPage />} />
      <Route path='/editChild' element={<EditChildPage />} />
      <Route path='/addReview' element={<AddReviewPage />} />
      <Route path='/myReviews' element={<MyReviewsPage />} />

      {/* Admin Routes */}
      <Route path='/adminhome' element={<AdminHomePage />} />
      <Route path='/adminUpload' element={<AdminUploadImg />} />
      <Route path='/manageAccounts' element={<ManageAccountsPage/>} />
      <Route path='/manageUserProfiles' element={<ManageUserProfilesPage/>} />
      <Route path='/createAdmin' element={<CreateAdminPage/>} />
      <Route path='/createProfile' element={<CreateProfilePage/>} />
      {/* <Route path='/editUserProfile' element={<EditUserProfilePage/>} />  */}
      <Route path='/viewAllAccounts' element={<ViewAllAccountsPage/>} />
      <Route path='/viewAllProfiles' element={<ViewAllProfilesPage/>} />
      <Route path='/viewAllReviews' element={<ViewAllReviewsPage/>} />

      <Route path='/editAccount' element={<EditAccountPage/>} /> 

    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);
