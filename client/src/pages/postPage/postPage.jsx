import React, { useState, useEffect } from "react";
import axios from 'axios';
import Post from "../../components/post/post";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import NavBar from "../../components/navBar/navBar";
import './postPage.css';
export default function PostPage(){
    const [post, setPost] = useState(null);
    const {postId} = useParams();
    const token = useSelector((state)=>state.token);
    const getPost = async()=>{
        if (token){
            try{
                const response =await axios.get(`${process.env.REACT_APP_SERVER}/${postId}`,
                {
                    headers:{ Authorization: `Frink ${token}` }
                });
                setPost(response.data);
                console.log(response);
            } catch (err) {
                console.log(err.response);
            }
        }
    }
    useEffect(()=>{
        getPost();
    },[])    
    if (post){
        return(
            <div className="postPage">
                <NavBar/>
                <div className="pageWrapper">
                    <Post post={post}/>
                </div>
            </div>
        )
    }
}