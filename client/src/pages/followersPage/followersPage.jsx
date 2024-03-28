import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PeopleList from "../../components/peopleList/peopleList";
import { useSelector } from "react-redux";
import axios from "axios";
import NavBar from "../../components/navBar/navBar";
import './followersPage.css'
export default function FollowersPage(props){
    const [people, setPeople]=useState(null);
    const {username} = useParams(); 
    const user = useSelector((state)=>state.user);
    const token = useSelector((state)=>state.token);
    const navigate = useNavigate();
    const getFollowers = async()=>{
        if (user && user.id && token){
            try{
                const response =await axios.get(`${process.env.REACT_APP_SERVER}/users/${username}/${props.type}?id=${user.id}`,
                {
                    headers:{ Authorization: `Frink ${token}` }
                });
                setPeople(response.data)
            } catch (err) {
                console.log(err.response);
            }
        } else {
            navigate("/");
        }
    }
    useEffect(()=>{
        getFollowers();
    },[])
    if (people){
        return(
            <div className="followersPage">
                <NavBar/>
                <div className="pageWrapper">
                    <div className="peopleWrapper">
                        <div className="peopleHeader">
                            <span className="material-symbols-outlined back" onClick={()=>navigate(-1)}>arrow_back</span>
                            {
                                props.type==="followers" ? 
                                <p>Followers</p>:
                                <p>Following</p>
                            }
                        </div>
                        <PeopleList people={people}/>
                    </div>

                </div>
            </div>
        )
    }else{
        return(
            <div className="followersPage">
                <p>Loading...</p>
            </div>
        )
    }
}