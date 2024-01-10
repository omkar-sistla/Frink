import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import { setLogin } from "../../Redux/reducer";
import "./loginPage.css";
import InputContainer from "../../components/inputContainer/inputContainer";
import ThemeSwitch from "../../components/themeSwitch/themeSwitch";
export default function LoginPage(){ 
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const mode = useSelector((state)=>state.mode);
    const user = useSelector((state)=>state.user);
    const [errorMsg, setErrorMsg] = useState();
    const [signInValues,setSignInValues] = useState({
        email:"",
        password:""
    });
    const handleSignInSubmission=async(e)=>{
        e.preventDefault();
        setLoading(true);
        if (!signInValues.email || !signInValues.password){
            setErrorMsg("Fill all the fields");
            setLoading(false);
            return;
        }
        setErrorMsg("");
        try{
            const loggedInResponse = await axios.post(
                "http://localhost:8800/login", signInValues, 
                {
                    headers:{"Content-Type": "application/json"},
                    withCredentials: true
                }
                );
            const loggedIn = loggedInResponse.data;
            if (loggedIn){
                dispatch(setLogin({
                    user:loggedIn.user,
                    token:loggedIn.token
                }))
            }
            console.log(user);
            setLoading(false);
            navigate("/home");
        } catch(err){
            setErrorMsg(err.response.data);
            setLoading(false);
        }
        setLoading(false);
    } 

    return(
        <div className="loginpage">

            <ThemeSwitch/>
            <div className="logincontent">
                {mode==="light"?
                    <img src="./assets/logo.jpeg" alt= "FRINK" className="loginPhoto"/>
                    : <img src="./assets/darkLogo.png" alt= "FRINK" className="loginPhoto"/>
                }                   
                <div className="outerbox">
                    {mode==="light"?
                        <img src="./assets/4.jpg" alt= "FRINK" className="loginLogo"/>
                        : <img src="./assets/5.jpg" alt= "FRINK" className="loginLogo"/>
                    }                    
                    <form className="loginForm">
                        <InputContainer type="text" label="Email" onChange = {(e)=>setSignInValues((prev)=>({...prev,email: e.target.value.toLowerCase()}))}/>
                        <InputContainer type="password" label="Password" onChange = {(e)=>setSignInValues((prev)=>({...prev,password: e.target.value}))}/>
                        <b>{errorMsg}</b>
                        {
                            loading ?  <button disabled><img src={mode==="light"?"./assets/loading light.gif":"./assets/loading dark.gif"} 
                                                    alt="loading" className="loadingAnimation" draggable="false"/>
                                    </button>
                            : <button onClick={handleSignInSubmission}>Login</button>
                        }
                        <p>Don't have an account? </p>
                        <button onClick={()=>{navigate("/signup")}}>SignUp</button>
                    </form>  
                </div>
            </div>
        </div>
    )
}