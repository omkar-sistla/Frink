import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./navBar.css"
import { useSelector } from "react-redux";
import ThemeSwitch from "../themeSwitch/themeSwitch";
import axios from 'axios';

export default function NavBar(){
    const assetsLink = "https://res.cloudinary.com/dl5qnhrkx/image/upload/v1704437765/Frink%20Assets/"
    const navigate = useNavigate()
    const mode = useSelector((state)=>state.mode);
    const user = useSelector((state)=>state.user);
    const [compressNav, setCompressNav] = useState(false);
    const [activeSearch, setActiveSearch] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState("./assets/logo.jpeg");
    useEffect(()=>{
        user && setProfilePhoto(user.profilePhoto);    
    },[user]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setsearchResults]=useState([]);
    const handleSearch = async()=>{
        try{
            if (searchTerm!==""){
                const response = await axios.get(`${process.env.REACT_APP_SERVER}/users/searchuser/${searchTerm}`);
                setsearchResults(response.data);
                console.log(response.data);
                console.log(searchResults);
            } else{
                setsearchResults([]);
            }
        } catch(err){
            console.log(err);
        }
    }
    const handleSearchClick = (user)=>{
        navigate(`/profile/${user.username}`);
        toggleSearch();
    }
    useEffect(()=>{
        handleSearch();
    },[searchTerm]);
    const toggleSearch = ()=>{
        if(compressNav===activeSearch){
            setActiveSearch(!activeSearch);
            setCompressNav(!compressNav);
        }
    }
    return (
        <div className={compressNav? "navbar compressed" : "navbar"}>
            <div className="upperNav">
                <div className="uppernavDiv">
                    <img src={mode==="light" ? assetsLink+"logoNameLight.jpg" : assetsLink+"logoNameDark.jpg"} className="navlogo large" alt="frink"/>
                </div>
                {/* <img src={mode==="light"?"./assets/navLogoSmallLight.png":"./assets/darklogo.png"} className="navlogo small"/> */}        
                <div className="uppernavDiv">
                    <i className="material-symbols-outlined">notifications</i>
                    <ThemeSwitch/>
                </div>
            </div>
            <div className="options">
                <div className="logoAndSwitch">
                    <img src={mode==="light" ? assetsLink+"logoNameLight.jpg" : assetsLink+"logoNameDark.jpg"} className="navlogo large" alt="frink logo"/>
                    <img src={mode==="light"?assetsLink+"logolight.png":assetsLink+"logoDark.png"} className="navlogo small" alt="frink logo"/>
                    <ThemeSwitch/>
                </div>
                <div className="navOptions home" onClick={()=>{navigate("/home")}}>
                    <i className="material-symbols-outlined">Home</i>
                    <p> Home </p>
                </div>            
                <div className="navOptions search" onClick={toggleSearch}>
                    <i className="material-symbols-outlined">search</i>
                    <p> Search </p>
                </div> 
                <div className="navOptions notif">
                    <i className="material-symbols-outlined">notifications</i>
                    <p> Notifications </p>
                </div>
                <div className="navOptions explore">
                    <i className="material-symbols-outlined">explore</i>
                    <p> Explore </p>
                </div>
                <div className="navOptions newpost" onClick={()=>{navigate("/newpost")}}>
                    <i className="material-symbols-outlined">add</i>
                    <p> New Post </p>
                </div>
                <div className="navOptions prof" onClick={()=>{navigate(`/profile/${user.username}`)}}>
                    <img src={profilePhoto} alt="profile pic" className="profilePhoto"/>
                    <p> Profile </p>
                </div>            
            </div>
            <div className={activeSearch?"searchBox active":"searchBox"}>
                <input placeholder="search" className="searchBoxSearch" type="text" onChange={(e)=>{setSearchTerm(e.target.value)}}/>
                <div className="searchresults">
                    {searchResults.map((user)=>(
                        <div className="searchedUser" key={user._id} onClick={()=>handleSearchClick(user)}>
                            <img className="profilePhoto" alt="" src={user.profilePhoto}/>
                            <div className="userdetails">
                                <p className="username">{user.username}</p>
                                <p className="displayname">{user.firstName+" "+user.lastName}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}