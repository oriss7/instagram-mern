import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom';
import './assets/style/App.scss';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import EditProfile from './popupPages/EditProfile';
import EditPost from './popupPages/EditPost';
import CreatePost from './popupPages/CreatePost'
import Search from './popupPages/Search'
import LikesPopup from './popupPages/LikesPopup'
import FollowersPopup from './popupPages/FollowersPopup'
import FollowingPopup from './popupPages/FollowingPopup'
import PostPopup from './popupPages/PostPopup'
import LogoutPopup from './popupPages/Logout'
import {AppProvider} from './context/AppProvider';
import { AuthContext } from './context/authContext.js';
import {useContext,useEffect} from 'react';
import { ReactComponent as LoadingIcon } from './assets/images/loader.svg';

function AppContent() {
  const { authState, loadLoggedInUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData(){
      const userFromAuth = await loadLoggedInUser();
      if (!userFromAuth) {
        navigate('/login');
      }
    }
    fetchData()
  }, []);
  
  if (authState.isLoading) {
    // return ('Loading in App...')
    return (
      <div className='loading-container'>
        <LoadingIcon />
      </div>
    )
  }
  
  return (
    <Routes>
      <Route path="/" element={<HomePage />}>
        <Route path="create" element={<CreatePost />} />
        <Route path="search" element={<Search />} />
        <Route path="likes/:postId" element={<LikesPopup />} />
        <Route path="logout" element={<LogoutPopup />} />
        <Route path="post/:postId" element={<PostPopup />} />
      </Route>
      <Route path="/profile/:userId" element={<ProfilePage />}>
        <Route path="editProfile" element={<EditProfile />} />
        <Route path="create" element={<CreatePost />} />
        <Route path="search" element={<Search />} />
        <Route path="followers" element={<FollowersPopup />} />
        <Route path="following" element={<FollowingPopup />} />
        <Route path="logout" element={<LogoutPopup />} />
        <Route path="post/:postId" element={<PostPopup />}>
          <Route path="editPost" element={<EditPost />} />
        </Route>
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </Router>
  );
}

export default App;