import React from "react";
import './comments.css'
import { convertTime } from "../post/post";
export default function Comments(props){
    const comment = props.comment;
    return(
        <div className="comment">
            <img src={comment.profilePhoto} className="userPhoto"/>
            <div className="commentBox">
                <div className="commentText">
                    <p className="theComment"><span className="userName">{comment.username}</span> {comment.comment}</p>
                </div>
                <p className="time">{convertTime(comment.createdAt)}</p>
            </div>
        </div>
    )
}