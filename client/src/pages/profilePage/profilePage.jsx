import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import './profilePage.css';
import NavBar from "../../components/navBar/navBar";
import { setLogin } from "../../Redux/reducer";
import PostsGrid from "../../components/postsGrid/postsgrid";

export default function ProfilePage(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {username} = useParams();
    const user = useSelector((state)=>state.user);
    const token = useSelector((state)=>state.token);
    const [userProfile,setUserProfile] = useState(null);
    const logout = () => {
        dispatch(setLogin({
            user:null,
            token:null
        }));
        navigate("/");
    }
    const getFollowersAndFollowings = async(userProfile, type)=>{
        if (user && user.id && token){
                navigate(`/profile/${userProfile.username}/${type}`)
        } else {
            navigate("/");
        }
    }
    const follow = async () => {
        if (user && user.id && token) {
            try {
                await axios.patch(
                    `${process.env.REACT_APP_SERVER}/users/follow/${user.id}/${userProfile.id}`,
                    {
                        id: user.id
                    },
                    {
                        headers: { Authorization: `Frink ${token}` }
                    }
                );
                getUserProfile();
                updateUser();
            } catch (err) {
                console.log(err);
            }
        } else {
            navigate("/");
        }
    };
    const updateUser = async()=>{
        try{
            const response = await axios.post(`${process.env.REACT_APP_SERVER}/updateuser`,
                {
                    id:user.id
                },
                {
                    headers: { Authorization: `Frink ${token}` }
                }
            )
            const data = response.data;
            if (data){
                dispatch(setLogin({
                    user:data.user,
                    token:data.token
                }))
            }
        } catch(err){
            console.log(err);
        }
    }
    const getUserProfile = async() =>{
        if (user && user.username === username){
            setUserProfile(user);
        } else{
            try{
                const response = user
                ? await axios.get(`${process.env.REACT_APP_SERVER}/users/${username}?id=${user.id}`, 
                {
                    headers: { Authorization: `Frink ${token}` }
                })
                : await axios.get(`${process.env.REACT_APP_SERVER}/users/${username}`,{headers: { Authorization: `Frink ${token}` }});                
                setUserProfile(response.data);
            } catch(err){
                console.log(err.response.data);
                return null;
            }
        }
    }
    useEffect(()=>{
        getUserProfile();
    },[username]);

    if (user && userProfile && user.username === userProfile.username){
        return(
            <div className="profilepage">
                <NavBar/>
                <div className="profile">
                    {user && 
                    <div className="profileHeader">
                        <img src={user.profilePhoto} className="profilePageProfilePhoto" alt="profile pic"/>
                        <div className="profileDetails">
                            <div className="row">
                                <img src={user.profilePhoto} className="profilePageProfilePhoto small" alt="profile pic"/>
                                <div className="innerRow">
                                    <p className="username">{user.username}</p>
                                    <div className="buttons">
                                        <button onClick={()=>navigate("/acoounts/edit")}>Edit profile</button>
                                        <button className="logout" onClick={logout}>Log Out</button>
                                    </div>
                                    
                                </div>
                            </div>
                            <div className="row countsRow">
                                <div className="counts">
                                    <p className="count">{user.posts}</p>
                                    <p className="field">posts</p>
                                </div>
                                <div className="counts" onClick={() => getFollowersAndFollowings(user,"followers")}>
                                    <p className="count" >{user.followers}</p>
                                    <p className="field">followers</p>
                                </div>
                                <div className="counts" onClick={() => getFollowersAndFollowings(user,"following")}>
                                    <p className="count">{user.followings}</p>
                                    <p className="field">following</p>
                                </div>
                            </div>
                            <div className="row">
                                <p className="displayname">{user.displayName}</p>
                                <p>{user.bio}</p>
                            </div>
                        </div>
                    </div>}
                    <PostsGrid posts={user.userPosts}/>
                </div>
            </div>
        )
    } else if (userProfile){
        return(
            <div className="profilepage">
                <NavBar/>
                <div className="profile otherUser">
                    {userProfile && 
                    <div className="profileHeader">
                        <img src={userProfile.profilePhoto} className="profilePageProfilePhoto" alt="profile pic"/>
                        <div className="profileDetails">
                            <div className="row">
                                <img src={userProfile.profilePhoto} className="profilePageProfilePhoto small" alt="profile pic"/>
                                <div className="innerRow">
                                    <p className="username">{userProfile.username}</p>
                                    {
                                        userProfile.isFollowing 
                                            ? <button onClick={follow}>Unfollow</button>
                                            : userProfile.isRequested 
                                                ? <button>Requested</button>
                                                : <button className="follow" onClick={follow}>Follow</button>
                                    }
                                </div>
                            </div>
                            <div className="row countsRow">
                                <div className="counts">
                                    <p className="count">{userProfile.posts}</p>
                                    <p className="field">posts</p>
                                </div>
                                <div className="counts" onClick={() => getFollowersAndFollowings(userProfile,"followers")}>
                                    <p className="count">{userProfile.followers}</p>
                                    <p className="field">followers</p>
                                </div>
                                <div className="counts" onClick={() => getFollowersAndFollowings(userProfile,"following")}>
                                    <p className="count">{userProfile.followings}</p>
                                    <p className="field">following</p>
                                </div>
                            </div>
                            <div className="row">
                                <p className="displayname">{userProfile.displayName}</p>
                                <p>{userProfile.bio}</p>
                            </div>
                        </div>
                    </div>}
                    {!userProfile.isPrivate || userProfile.isFollowing 
                    ? <div>
                    {<PostsGrid posts={userProfile.profileposts}/>}
                    </div>                    
                    :<div>This account is Private</div>}
                </div>
            </div>
        )
    }
}