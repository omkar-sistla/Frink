import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import "./homepage.css";
import NavBar from "../../components/navBar/navBar";
import Post from "../../components/post/post";
import axios from 'axios'
const feeds = [
    {
        "userId": {
            "_id": "65957f9e32e6b1d6de92cb1f",
            "username": "Pattabhi",
            "firstName": "Pattabhi",
            "lastName": "Sistla",
            "profilePhoto": "https://res.cloudinary.com/dl5qnhrkx/image/upload/v1704296347/tmowv6dyd2gxoal9xvzb.jpg"
        },
        "desc": "post 4",
        "img": "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQgByBT5IiAT_a2x9pUVb4VMoOrlzHH7Jrzj-HB5jzHlR4lNLMS",
        "likes": {},
        "comments": [],
        "location": "Piduguralla",
        "_id": "659a7a9eada43abbfecc64f4",
        "createdAt": "2024-01-07T10:19:10.600Z",
        "updatedAt": "2024-01-07T10:19:10.600Z",
        "__v": 0
    },
    {
        "userId": {
            "_id": "658c2eff58c1730f5c23a27f",
            "username": "test",
            "firstName": "test",
            "lastName": "account",
            "profilePhoto": ""
        },
        "desc": "post 3",
        "img": "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQgByBT5IiAT_a2x9pUVb4VMoOrlzHH7Jrzj-HB5jzHlR4lNLMS",
        "likes": {
            "omkar":true,
            "kesev":true
        },
        "comments": [],
        "location": "Piduguralla",
        "_id": "659a6ff0570c06c4d1aaedf7",
        "createdAt": "2024-01-07T09:33:36.707Z",
        "updatedAt": "2024-01-07T09:33:36.707Z",
        "__v": 0
    },
    {
        "userId": {
            "_id": "65957f9e32e6b1d6de92cb1f",
            "username": "Pattabhi",
            "firstName": "Pattabhi",
            "lastName": "Sistla",
            "profilePhoto": "https://res.cloudinary.com/dl5qnhrkx/image/upload/v1704296347/tmowv6dyd2gxoal9xvzb.jpg"
        },
        "desc": "post 1",
        "img": "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQgByBT5IiAT_a2x9pUVb4VMoOrlzHH7Jrzj-HB5jzHlR4lNLMS",
        "likes": {},
        "comments": [],
        "location": "Piduguralla",
        "_id": "659a5bfb13c0c3bee6af314c",
        "createdAt": "2024-01-07T08:08:27.045Z",
        "updatedAt": "2024-01-07T08:08:27.045Z",
        "__v": 0
    }
]
export default function HomePage(){
    const[feed,setFeed] = useState(null);
    const token = useSelector((state)=>state.token);
    const getFeed = async()=>{
        try{
            const response = await axios.get("http://localhost:8800/feed",{headers: { Authorization: `Frink ${token}` }});
            setFeed(response.data);
        } catch(err){
            console.log(err.response.data);
        }
    }
    useEffect(()=>{
        getFeed();
    },[])
    
    return(
        <div className="homepage">
            <NavBar/>
            <div className="outerDiv">
                {feed && <div className="feed">
                    {feed.map((post)=>(<Post key={post._id} post={post}/>))}
                </div>}
            </div>
        </div>
    )
}