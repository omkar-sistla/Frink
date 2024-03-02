import React, { useEffect, useState } from "react";
import axios from 'axios';
import "./recommendations.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
function Recommendation(props){
    const navigate = useNavigate()
    return(
        <div className="recommendation">
            <div className="user">
                <img src={props.img} alt={props.username}/>
                <p onClick={()=>navigate(`/profile/${props.username}`)}>{props.username}</p>
            </div>
            <p className="follow">Follow</p>
        </div>
    )
}
export default function Recommendations(props){
    const [rec, setRec] = useState(null);
    const user = useSelector((state)=>state.user);
    const getRec = async()=>{
        try{
            const response = await axios.get(`${process.env.REACT_APP_SERVER}/users/${user.id}/recommendations`);
            setRec(response.data);
        } catch(err){
            console.log(err.message);
        }
    }
    useEffect(()=>{
        getRec();
    },[])
    console.log(rec);
    if (rec && rec.length>0){
        return(
            <div className={"recommendation_sec "+props.class}>
                <div className="recommendationsHeader">
                    <p>Recommended for you</p>
                </div>
                <div className="recommendations">
                    {rec.map((recUser)=>(<Recommendation key={recUser._id} img={recUser.profilePhoto} username={recUser.username}/>))}
                </div>
            </div>
        )
    } else{
        return
    }
}