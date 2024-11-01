import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import {BrowserRouter, Routes, Route} from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute';

// Main Home Pages
import OurApp from './routes/OurAppPage'
import AboutPage from './routes/AboutPage'
import ContactPage from './routes/ContactPage'
import LoginPage from './routes/LoginPage'

// Child Pages
import ChildHomePage from './routes/ChildHomePage';
import GameSelectionPage from './routes/GameSelectionPage';
import MatchPictureGamePage from './routes/MatchPictureGamePage'; 
import StorytellingGamePage from './routes/StorytellingGamePage';
import GalleryPage from './routes/galleryPage';
import ChildExplorePage from './routes/ChildExplorePage'
import Avatar from './routes/Avatar'
import ImageCaptionPage from "./routes/ImageCaptionPage";

// Parent Pages
import SubscriptionPlansPage from './routes/SubscriptionPlansPage';
import PaymentScreenPage from './routes/PaymentScreenPage';
import { PaymentSuccess, PaymentCancel } from './parentsComponent/PaymentScreen';
import AchievementsAndActivityPage from './routes/AchievementsAndActivityPage';
import ParentHomePage from './routes/ParentHomePage';
import CreateChildPage from './routes/CreateChildPage';
import EditChildPage from './routes/EditChildPage';
import AddReviewPage from './routes/AddReviewPage';
import MyReviewsPage from './routes/MyReviewsPage';
import ProfilePage from './routes/ProfilePage'

// Admin Pages
import AdminHomePage from './routes/AdminHomePage';
import AdminUploadImg from './routes/AdminUploadPage'
import ManageAccountsPage from './routes/ManageAccountsPage';
import ManageUserProfilesPage from './routes/ManageUserProfilesPage';
import CreateAdminPage from './routes/CreateAdminPage';
import CreateProfilePage from './routes/CreateProfilePage';
import ViewAllAccountsPage from './routes/ViewAllAccountsPage';
import ViewAllProfilesPage from './routes/ViewAllProfilesPage';
import ViewAllReviewsPage from './routes/ViewAllReviewsPage';
import ViewDataPage from './routes/ViewDataPage';
import EditAccountPage from './routes/EditAccountPage';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />

      {/* Main Home Routes */}
      <Route path='/ourApp' element={<OurApp />} />
      <Route path='/about' element={<AboutPage />} />
      <Route path='/contact' element={<ContactPage />} />
      <Route path='/login' element={<ProtectedRoute redirectTo="/"><LoginPage /></ProtectedRoute>} />
      <Route path="/imageCaptioning" element={<ImageCaptionPage />} />
      
      {/* Child Routes */}
      <Route path='/childhome' element={<ProtectedRoute role="child"><ChildHomePage /></ProtectedRoute>} />
      <Route path="/games" element={<ProtectedRoute role="child"><GameSelectionPage /></ProtectedRoute>} />
      <Route path="/match-picture" element={<ProtectedRoute role="child"><MatchPictureGamePage /></ProtectedRoute>} />
      <Route path="/storytelling-game" element={<ProtectedRoute role="child"><StorytellingGamePage /></ProtectedRoute>} />
      <Route path='/galleryPage' element={<ProtectedRoute role="child"><GalleryPage /></ProtectedRoute>} />
      <Route path='/explorePage' element={<ProtectedRoute role="child"><ChildExplorePage /></ProtectedRoute>} />
      <Route path='/avatar' element={<ProtectedRoute role="child"><Avatar /></ProtectedRoute>} />

      {/* Parent Routes */}
      <Route path='/parenthome' element={<ProtectedRoute role="parent"><ParentHomePage /></ProtectedRoute>} />
      <Route path='/subscriptionPlans' element={<ProtectedRoute role="parent"><SubscriptionPlansPage /></ProtectedRoute>} />
      <Route path="/paymentScreen" element={<ProtectedRoute role="parent"><PaymentScreenPage /></ProtectedRoute>} />
      <Route path="/paymentSuccess" element={<ProtectedRoute role="parent"><PaymentSuccess /></ProtectedRoute>} />
      <Route path="/paymentCancel" element={<ProtectedRoute role="parent"><PaymentCancel /></ProtectedRoute>} />
      <Route path='/achievementsAndActivity' element={<ProtectedRoute role="parent"><AchievementsAndActivityPage /></ProtectedRoute>} />
      <Route path='/createChild' element={<ProtectedRoute role="parent"><CreateChildPage /></ProtectedRoute>} />
      <Route path='/editChild' element={<ProtectedRoute role="parent"><EditChildPage /></ProtectedRoute>} />
      <Route path='/addReview' element={<ProtectedRoute role="parent"><AddReviewPage /></ProtectedRoute>} />
      <Route path='/myReviews' element={<ProtectedRoute role="parent"><MyReviewsPage /></ProtectedRoute>} />
      <Route path='/profile' element={<ProtectedRoute role="parent"><ProfilePage /></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path='/adminhome' element={<ProtectedRoute role="admin"><AdminHomePage /></ProtectedRoute>} />
      <Route path='/adminUpload' element={<ProtectedRoute role="admin"><AdminUploadImg /></ProtectedRoute>} />
      <Route path='/manageAccounts' element={<ProtectedRoute role="admin"><ManageAccountsPage /></ProtectedRoute>} />
      <Route path='/manageUserProfiles' element={<ProtectedRoute role="admin"><ManageUserProfilesPage /></ProtectedRoute>} />
      <Route path='/createAdmin' element={<ProtectedRoute role="admin"><CreateAdminPage /></ProtectedRoute>} />
      <Route path='/createProfile' element={<ProtectedRoute role="admin"><CreateProfilePage /></ProtectedRoute>} />
      <Route path='/viewAllAccounts' element={<ProtectedRoute role="admin"><ViewAllAccountsPage /></ProtectedRoute>} />
      <Route path='/viewAllProfiles' element={<ProtectedRoute role="admin"><ViewAllProfilesPage /></ProtectedRoute>} />
      <Route path='/viewAllReviews' element={<ProtectedRoute role="admin"><ViewAllReviewsPage /></ProtectedRoute>} />
      <Route path='/viewData' element={<ProtectedRoute role="admin"><ViewDataPage /></ProtectedRoute>} />
      <Route path='/editAccount' element={<ProtectedRoute role={["admin", "parent"]}><EditAccountPage /></ProtectedRoute>} />
    
      <Route path='/unauthorized' element={
        <div style={{ textAlign: 'center', margin: '50px' }}>
          <h1>Unauthorized Access</h1> 
          <p style={{ color: "white" }}>You do not have permission to view this page.</p>
          <a 
            href="/" 
            className="profile-btn"
            onMouseEnter={(e) => {e.currentTarget.style.color = 'white'; e.currentTarget.style.textDecoration = 'none';}}
          >
            Back to Home
          </a>
        </div>
      } />

    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);
