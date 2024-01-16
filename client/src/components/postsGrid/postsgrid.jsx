import React from "react";
import './postsgrid.css';

export default function PostsGrid(props){
    const posts = props.posts
    return (
        <div className="postsGrid">
            {posts.map((post)=>
            <div className="postsGridCell" key={post._id}>
                <img src={post.img} alt="" className="postPreview"/>
            </div>)}
        </div>
    )
}