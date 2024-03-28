import React, { useState } from "react";
import './postsgrid.css';
import { useNavigate } from "react-router-dom";

export default function PostsGrid(props){
    const [hoveredPost, setHoveredPost] = useState(null);
    const posts = props.posts;
    const navigate = useNavigate();

    return (
        <div className="postsGrid">
            {posts.map((post, index) => (
                <div className="postsGridCell" key={post._id} onMouseEnter={() => setHoveredPost(index)} onMouseLeave={() => setHoveredPost(null)}
                    onClick={() => navigate(`/posts/${post._id}`)}
                >
                    <img src={post.img} alt="" className="postPreview"/>
                    {hoveredPost === index && (
                        <div className="likesPreview">
                            <p>{Object.keys(post.likes).length} <span className="material-symbols-outlined">favorite</span></p>
                            <p>{post.comments.length}<span className="material-symbols-outlined">mode_comment</span></p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
