import React, { useState } from "react";
import axios from "axios";
import './uploadPost.css';
import FileInput from "../inputContainer/fileInput";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import NavBar from "../navBar/navBar";
export default function NewPost(){
    const navigate = useNavigate();
    const assets = "https://res.cloudinary.com/dl5qnhrkx/image/upload/v1705028150/Frink%20Assets/";
    const user = useSelector((state)=>state.user);
    const token = useSelector((state)=>state.token);
    const mode = useSelector((state)=>state.mode);
    const [image,setImage]=useState(null);
    const [visible,setVisible]=useState(true);
    const [uploading,setUploading]=useState(false);
    const changeImage = (e)=>{
        setImage(e.target.files[0]);
        setVisible(false);
    }
    const [postValues, setPostValues]=useState({
        desc:"",
        location:""
    })
    const submitPost = async(e)=>{
        setUploading(true);
        e.preventDefault();
        const data = new FormData();
        data.append("file",image);
        data.append("upload_preset","sta9llrw");
        data.append("cloud_name","dl5qnhrkx");
        const postData = {...postValues};
        try{
            if(image){
                const imageResponse = await axios.post("https://api.cloudinary.com/v1_1/dl5qnhrkx/image/upload",data)
                const imagelink = imageResponse.data.secure_url;
                postData.img=imagelink;
            }
            const response = await axios.post(`${process.env.REACT_APP_SERVER}/newpost`, postData, {
                headers: { Authorization: `Frink ${token}` },
                withCredentials: true
            });
            setUploading(false);
            navigate("/home", { replace: true });
        } catch(err){
            console.log(err);
        }
        setUploading(false);
    }
    return(
        <div className="newPostPage">
            <NavBar/>
            <div className="newPost">
                <div className="newPostHeader">
                    {!visible&&<i className="material-symbols-outlined" onClick={()=>(setVisible(true))}>arrow_back</i>}
                    <p>Create New Post</p>
                    {!visible && (!uploading ? <p className="share" onClick={submitPost}>Share</p> : <img src={mode==="light" ? assets+"loadingLight.gif" : assets+"loadingDark.gif"} className="uploading"/>)}
                </div>
                <div className={visible?"inner active":"inner"}>
                    <div className={visible ? "section1 active" : "section1"}>             
                        <FileInput onChange={(e)=>changeImage(e)} accept=".jpg, .png, .jpeg"/>
                    </div>
                    <div className={visible ? "section2" : "section2 active"}>
                        <div className="postImage">
                            {image && <img src={URL.createObjectURL(image)} alt=""/>}
                        </div>
                        <div className="postdetails">
                            <div className="userDetails">
                                <img src={user.profilePhoto} className="profilePic"/>
                                <p className="username">{user.username}</p>
                            </div>
                            <textarea placeholder="Write a caption" className="description" onChange={(e)=>setPostValues((prev)=>({...prev,desc:e.target.value}))}></textarea>
                            <input placeholder="Add location" className="location" onChange={(e)=>setPostValues((prev)=>({...prev,location:e.target.value}))}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}