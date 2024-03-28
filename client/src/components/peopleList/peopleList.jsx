import React from "react";
import { useNavigate } from "react-router-dom";
import './peopleList.css';

export default function PeopleList(props){
    const people = props.people;
    const navigate = useNavigate();
    console.log(people);
    return(
        <div className="people">
            {people.map((person)=>(
                <div className="person" key={person._id}>
                    <img src={person.profilePhoto} className="profilePhoto"/>
                    <div className="details">
                        <p className="username" onClick={()=>navigate(`/profile/${person.username}`)}>{person.username}</p>
                        <p className="displayName">{person.firstName+" "+person.lastName}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}