import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import "./homepage.css";
import NavBar from "../../components/navBar/navBar";
import Post from "../../components/post/post";
import axios from 'axios'
import Recommendations from "../../components/recommendations/recommendations";

export default function HomePage(){
    const[feed,setFeed] = useState(null);
    const token = useSelector((state)=>state.token);
    const getFeed = async()=>{
        try{
            const response = await axios.get("https://frink-backend.vercel.app/feed",{headers: { Authorization: `Frink ${token}` }});
            setFeed(response.data);
        } catch(err){
            console.log(err.response);
        }
    }
    useEffect(()=>{
        getFeed();
    },[])
    const deletePost = async(postId)=>{
        try{
            const response = await axios.delete(`https://frink-backend.vercel.app/${postId}/delete`,{headers: { Authorization: `Frink ${token}` }});
            setFeed(feed.filter(post => post._id !== postId));
        } catch(err){
            console.log(err);
        }
    }
    if (feed && feed.length>0){
        return(
            <div className="homepage">
                <NavBar/>
                <div className="outerDiv">
                    <div className="innerDiv">
                        {
                            feed && (feed.length>2 ? 
                            <div className="feed">
                                {feed.slice(0,2).map((post)=>(<Post key={post._id} post={post} onDelete={()=>deletePost(post._id)}/>))}
                                <Recommendations class="smallScreen"/>
                                {feed.slice(2).map((post)=>(<Post key={post._id} post={post} onDelete={()=>deletePost(post._id)}/>))}
                            </div> : 
                            feed.length>0 && <div className="feed">
                                {feed.map((post)=>(<Post key={post._id} post={post} onDelete={()=>deletePost(post._id)}/>))}
                                <Recommendations class="smallScreen"/>
                            </div>
                            )
                        }
                        <Recommendations class="largeScreen"/>
                    </div>
                </div>          
            </div>
        )
    } else if(feed&&feed.length<1){
        return(
            <div className="homepage">
                <NavBar/>
                <div className="outerDiv newUser">
                    <h1>Follow people to get posts from them</h1>
                    <Recommendations/>
                </div>
            </div>
        )
    }
}