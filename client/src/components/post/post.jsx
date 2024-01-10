import React, { useEffect, useState } from "react";
import "./post.css"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import Comments from "../comments/comments";
export function convertTime(timeStr) {
    try {
        // Parse the ISO 8601 formatted time string to a Date object
        const dateObject = new Date(timeStr);

        // Calculate the difference in seconds between the current date and the input date
        const secondsDifference = (Date.now() - dateObject.getTime()) / 1000;

        // Define the time thresholds
        const minuteThreshold = 60;
        const hourThreshold = 3600;
        const dayThreshold = 86400; // 24 hours
        const weekThreshold = 604800; // 7 days
        const monthThreshold = 2592000; // 30 days (approximate)
        const yearThreshold = 31536000; // 365 days (approximate)

        // Compare the input time with thresholds and convert accordingly
        if (secondsDifference < minuteThreshold) {
            return `${Math.floor(secondsDifference)} sec`;
        } else if (secondsDifference < hourThreshold) {
            return `${Math.floor(secondsDifference / 60)} min`;
        } else if (secondsDifference < dayThreshold) {
            return `${Math.floor(secondsDifference / 3600)} h`;
        } else if (secondsDifference < weekThreshold) {
            return `${Math.floor(secondsDifference / 86400)} d`;
        } else if (secondsDifference < monthThreshold) {
            return `${Math.floor(secondsDifference / 604800)} w`;
        } else if (secondsDifference < yearThreshold) {
            return `${Math.floor(secondsDifference / 2592000)} m`;
        } else {
            return `${Math.floor(secondsDifference / 31536000)} y`;
        }
    } catch (error) {
        return "Invalid input";
    }
}

export default function Post(props){
    const post = props.post
    const token = useSelector((state)=>state.token);
    const user = useSelector((state)=>state.user);
    const userId = user.id;        
    const [currentPost,setCurrentPost] = useState(post);
    const [newComment,setNewComment] = useState("");
    const [isLiked, setIsLiked] = useState(currentPost.likes[userId])
    const [commentLoading, setCommentLoading]=useState(false);
    const [comments, setComments]=useState(null);
    const navigate = useNavigate();
    const likepost = async()=>{
        if(!token){
            navigate("/")
        } else{
            try{
                const response = await axios.patch(`http://localhost:8800/${post._id}/like`,null,{headers: {Authorization: `Frink ${token}`,},});
                setCurrentPost((prev)=>({...prev,likes:response.data.likes}));
            } catch(err){
                console.log(err);
            }
        }

    }
    const handlePostComment = async() => {
        if(!token){
            navigate("/")
        } else{
            setCommentLoading(true);
            try{
                const response = await axios.patch(`http://localhost:8800/${post._id}/comment`,{comment:newComment},{headers: {Authorization: `Frink ${token}`,},});
                console.log(response);
                setCurrentPost((prev)=>({...prev,comments:response.data.comments}));
            } catch(err){
                console.log(err);
            }
            console.log(newComment);
            setNewComment("");
            setCommentLoading(false);
        }
    }
    const handleViewComment = async() => {
        try{
            const response=await axios.get(`http://localhost:8800/${post._id}/comments`,{headers: {Authorization: `Frink ${token}`,},});
            console.log(response);
            setComments(response.data);
            console.log(comments);
        } catch(err){
            console.log(err);
        }
    }
    useEffect(()=>{
        setIsLiked(currentPost.likes[userId]);
    },[currentPost]);
    return(
        <div className="post">
            <div className="postHeader">
                <div className="userDetails">
                    <img src={currentPost.userId.profilePhoto} alt="profile pic"/>
                    <div className="names">
                        <div className="nameAndTime">
                            <p className="username" onClick={()=>{navigate(`/profile/${currentPost.userId.username}`)}}>{currentPost.userId.username}</p>
                            <div className="dot"></div>
                            <p className="time">{convertTime(currentPost.createdAt)}</p>
                        </div>
                        <p className="location">{currentPost.location}</p>
                    </div>
                </div>
            </div>
            <div className="postbody">
                <img src={post.img} alt="post"/>
            </div>
            <div className="postActions">
                <div className="likesAndComments">
                    <i className={isLiked?"material-symbols-outlined liked":"material-symbols-outlined"} onClick={likepost}>favorite</i>
                    <i className="material-symbols-outlined">mode_comment</i>            
                </div>
                {currentPost.likes && Object.keys(currentPost.likes).length>0 && <p className="likes">{Object.keys(currentPost.likes).length+" likes"}</p>}
                {currentPost.desc!==""&&
                <div className="description">
                    <span className="username">{currentPost.userId.username}</span>
                    <p>{currentPost.desc}</p>
                </div>}
                {currentPost.comments && currentPost.comments.length>0 &&
                <p onClick={handleViewComment}>{"view "+currentPost.comments.length+" comments"}</p>}
            </div>
            <div className="commentField">
                <textarea placeholder="Add a comment" onChange={(e) => setNewComment(e.target.value)} value={newComment}></textarea>
                {
                    !commentLoading
                    ?<p className={newComment==="" ? "commentPost" : "commentPost active"} onClick={handlePostComment}>Post</p>
                    :<p className={newComment==="" ? "commentPost" : "commentPost active"}>loading</p>
                }
            </div>
            {comments && <div>
                {comments.map((comment)=>(<Comments key={comment._id} comment={comment} />))}
            </div>}
        </div>
    )
}