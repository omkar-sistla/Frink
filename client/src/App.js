import './App.css';
import {BrowserRouter as Router, Navigate, Routes, Route} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import LoginPage from './pages/loginPage/loginPage';
import RegisterPage from './pages/registerPage/registerPage';
import HomePage from './pages/HomePage/homepage';
import ProfilePage from './pages/profilePage/profilePage';
import NewPost from './components/uploadPost/uploadPost';
function App() {
  const mode = useSelector((state)=>state.mode);
  const isAuth = Boolean(useSelector((state) => state.token));
  return (
    <div className={`App ${mode}`}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage/>}/>
          <Route path="/signup" element={<RegisterPage/>}/>
          <Route path="/home" element={isAuth ? <HomePage /> : <Navigate to="/"/>}/>
          <Route path="/profile/:username" element={<ProfilePage/>}/>
          <Route path="/newpost" element={isAuth ? <NewPost/> : <Navigate to="/"/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
