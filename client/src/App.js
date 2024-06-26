import './App.css';
import {BrowserRouter as Router, Navigate, Routes, Route} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import LoginPage from './pages/loginPage/loginPage';
import RegisterPage from './pages/registerPage/registerPage';
import HomePage from './pages/HomePage/homepage';
import ProfilePage from './pages/profilePage/profilePage';
import NewPost from './components/uploadPost/uploadPost';
import { useEffect } from 'react';
import axios from 'axios';
import { setLogin } from './Redux/reducer';
import FollowersPage from './pages/followersPage/followersPage';
import PostPage from './pages/postPage/postPage';
import EditProfilePage from './pages/editProfilePage/editProfilePage';
function App() {
  const dispatch = useDispatch();
  const mode = useSelector((state)=>state.mode);
  const isAuth = Boolean(useSelector((state) => state.token));
  const token = useSelector((state)=>state.token);
  useEffect(()=>{
    const autoLogout = async()=>{
      try{
        const response = await axios.get(`${process.env.REACT_APP_SERVER}/`,{headers: { Authorization: `Frink ${token}` }});
        if (response.data === "Please Login"){
          dispatch(setLogin({
            user:null,
            token:null
          }))
        }
      } catch(err){
        dispatch(setLogin({
          user:null,
          token:null
        }))
      }
    }
    autoLogout();
  },[]);
  return (
    <div className={`App ${mode}`}>
      <Router>
        <Routes>
          <Route path="/" element={!isAuth ? <LoginPage/> : <Navigate to="/home"/>}/>
          <Route path="/signup" element={<RegisterPage/>}/>
          <Route path="/home" element={isAuth ? <HomePage /> : <Navigate to="/"/>}/>
          <Route path="/profile/:username" element={<ProfilePage/>}/>
          <Route path="/newpost" element={isAuth ? <NewPost/> : <Navigate to="/"/>}/>
          <Route path="profile/:username/followers" element={isAuth ? <FollowersPage type="followers"/> : <Navigate to="/"/>}/>
          <Route path="profile/:username/following" element={isAuth ? <FollowersPage type="followings"/> : <Navigate to="/"/>}/>
          <Route path="/posts/:postId" element={isAuth ? <PostPage/> : <Navigate to="/"/>}/>
          <Route path="/acoounts/edit" element={isAuth ? <EditProfilePage/> : <Navigate to="/"/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
