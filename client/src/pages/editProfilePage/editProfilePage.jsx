import React, { useState } from "react";
import './editProfilePage.css'
import NavBar from "../../components/navBar/navBar";
import { useSelector,useDispatch } from "react-redux";
import { setLogin } from "../../Redux/reducer";
import axios from "axios";
import FileInput from "../../components/inputContainer/fileInput";
export default function EditProfilePage(){
    const dispatch = useDispatch();
    const token = useSelector((state)=>state.token);
    const user = useSelector((state)=>state.user);
    const mode = useSelector((state)=>state.mode);
    const assets = "https://res.cloudinary.com/dl5qnhrkx/image/upload/v1705028150/Frink%20Assets/";
    const [details, setDetails] = useState({
        'username':user.username,
        'bio':user.bio,
        'city':user.city,
        'date_of_birth':user.date_of_birth.split('T')[0]
    });
    const [file, setFile] = useState(null);
    const [active, setActive]=useState(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
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
    const updateProfile = async(e)=>{
        e.preventDefault();
        try{
            setActive(false);
            const response = await axios.patch(
                `${process.env.REACT_APP_SERVER}/profile/update-profile`, details, 
                {
                    headers:{ Authorization: `Frink ${token}` },
                    withCredentials: true
                }
            );
            updateUser();
            alert(response.data)
        } catch(err){
            console.log(err);
            alert("Unexpected Error");
        }
    }
    const updateProfilePhoto = async(e)=>{
        e.preventDefault();
        setLoading(true);
        try{
            const data = new FormData();
            data.append("file",file);
            data.append("upload_preset","sta9llrw");
            data.append("cloud_name","dl5qnhrkx");
            if (file){
                const imageResponse = await axios.post("https://api.cloudinary.com/v1_1/dl5qnhrkx/image/upload",data);
                const imagelink = imageResponse.data.secure_url;
                console.log(imagelink);
                const response = await axios.patch(
                    `${process.env.REACT_APP_SERVER}/profile/update-profile-photo`, { imagelink: imagelink }, 
                    {
                        headers:{ Authorization: `Frink ${token}` },
                        withCredentials: true
                    }
                );
                updateUser();
                setLoading(false);
                setOpen(false);
                setFile(null);
                alert(response.data);
            } else{
                const imagelink = "https://res.cloudinary.com/dl5qnhrkx/image/upload/v1704699496/Frink%20Assets/default%20user.png"
                const response = await axios.patch(
                    `${process.env.REACT_APP_SERVER}/profile/update-profile-photo`, { imagelink: imagelink }, 
                    {
                        headers:{ Authorization: `Frink ${token}` },
                        withCredentials: true
                    }
                );
                updateUser();
                setLoading(false);
                setOpen(false);
                setFile(null);
                alert(response.data);
            }
        } catch(err){
            setOpen(false);
            alert("Unexpected Error");
        }        
    }

    return(
        <div className="editProfilePage">
            <NavBar/>
            <div className="pageWrapper">
                <div className="editProfileHeader">
                    <h2>Edit profile</h2>
                </div>
                <div className="userDetails">
                    <div className="user">
                        <img src={user.profilePhoto} alt="profile pic" className="profilephoto"/>
                        <div className="names">
                            <b className="username">{user.username}</b>
                            <p className="displayName">{user.displayName}</p>
                        </div>
                    </div>
                    <button onClick={()=>setOpen(true)}>Change photo</button>
                </div>
                {open && <div className="modalWrapper">
                    {!loading ? <div className="changeProfilePhoto">
                        <div className="modalHeader">
                            <p>Change Profile Photo</p>
                            <span className="material-symbols-outlined" onClick={()=>setOpen(false)}>close</span>
                        </div>
                        <div className="changeOptions">
                            <p className="remove" onClick={updateProfilePhoto}>Remove Current Photo</p>
                            <FileInput accept=".jpg, .png, .jpeg" label="Change Photo" 
                                onChange = {(e)=>{
                                    setFile(e.target.files[0]);
                                }}
                            />
                            <button onClick={updateProfilePhoto}>Click to Upload</button>
                        </div>                       
                    </div>
                    :<img src={assets+"loadingDark.gif"} className="loading" draggable="false"/>
                    }
                </div>}
                <div className="profileEditField">
                    <b>Username</b>
                    <input value={details.username} 
                        onChange={(e)=>{
                            setDetails((prev)=>({...prev,username:e.target.value.toLowerCase()}))
                            setActive(true)
                        }}
                    />
                </div>
                <div className="profileEditField">
                    <b>Bio</b>
                    <textarea className="Bio" value={details.bio} 
                        onChange={(e)=>{
                            setDetails((prev)=>({...prev,bio:e.target.value}));
                            setActive(true);
                        }}
                    ></textarea>
                </div>
                <div className="profileEditField">
                    <b>City</b>
                    <input value={details.city} 
                        onChange={(e)=>{
                            setDetails((prev)=>({...prev,city:e.target.value}));
                            setActive(true);
                        }}
                    />
                </div>
                <div className="profileEditField">
                    <b>Date of Birth</b>
                    <input type="date" value={details.date_of_birth} 
                        onChange={(e)=>{
                            setDetails((prev)=>({...prev,date_of_birth:e.target.value}));
                            setActive(true);
                        }}
                    />
                </div>
                <div className="buttonWrapper">
                    <button onClick={updateProfile} className="submit" disabled={!active}>Save</button>
                </div>
            </div>
        </div>
    )
}