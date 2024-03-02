import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { setMode } from "../../Redux/reducer";
import "../loginPage/loginPage.css";
import "./registerPage.css"
import InputContainer from "../../components/inputContainer/inputContainer";
import FileInput from "../../components/inputContainer/fileInput";
import axios from "axios";
export default function RegisterPage(){ 
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const mode = useSelector((state)=>state.mode);
    const [errorMsg, setErrorMsg] = useState();
    const [file,setFile] = useState(null);
    const [registerValues,setRegisterValues] = useState({
        email:"",
        password:"",
        confirmPassword:"",
        firstName:"",
        lastName:"",
        username:"",
        date_of_birth:""
    });
    const handleRegisterSubmission=async(e)=>{
        e.preventDefault();
        setLoading(true);
        console.log(registerValues)
        const data = new FormData();
        data.append("file",file);
        data.append("upload_preset","sta9llrw");
        data.append("cloud_name","dl5qnhrkx");
        if (!registerValues.email || !registerValues.password || !registerValues.confirmPassword 
            || !registerValues.firstName || !registerValues.username || !registerValues.date_of_birth){
            setErrorMsg("Fill all the fields");
            setLoading(false);
            return;
        }
        if (registerValues.password!==registerValues.confirmPassword){
            setErrorMsg("Passwords not matched");
            setLoading(false);
            return;
        }
        if (registerValues.password.length < 8 || !/[A-Z]/.test(registerValues.password) || !/[a-z]/.test(registerValues.password) || !/[0-9]/.test(registerValues.password) || !/[!@#$%^&*]/.test(registerValues.password)) {
            setErrorMsg("Password should have a minimum of 8 characters, including at least 1 uppercase letter, 1 lowercase letter, 1 numerical digit, and 1 special character");
            setLoading(false);
            return;
        }
        setErrorMsg("");
        const registrationData = { ...registerValues };
        try{
            if (file){
                const imageResponse = await axios.post("https://api.cloudinary.com/v1_1/dl5qnhrkx/image/upload",data);
                const imagelink = imageResponse.data.secure_url;
                console.log(imagelink);
                registrationData.profilePhoto = imagelink;
            }
            console.log(registrationData);
            const response=await(axios.post(`${process.env.REACT_APP_SERVER}/register`,registrationData,{withCredentials:true}));
            alert(response.data.message); 
            setLoading(false);
            window.location.href="/";
            alert("Logged In Successfully");
        } catch(err){
            err.response && err.response.data ? setErrorMsg(err.response.data) : setErrorMsg("Internal Server Error 😔");
            setLoading(false);
        }
        setLoading(false);
    }

    return(
        <div className="loginpage registerpage">
            <div className="themeSwitch">
                <div className={`circle ${mode}`}></div>
                <i className="material-symbols-outlined" onClick={()=>dispatch(setMode())}>light_mode</i>
                <i className="material-symbols-outlined" onClick={()=>dispatch(setMode())}>dark_mode</i>
            </div>
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
                    <p className="registertag">Sign up to see photos and videos from your friends.</p>   
                    <form className="loginForm">
                        <InputContainer type="text" label="First Name *" onChange = {(e)=>setRegisterValues((prev)=>({...prev,firstName: e.target.value.toLowerCase()}))}/>
                        <InputContainer type="text" label="Last Name" onChange = {(e)=>setRegisterValues((prev)=>({...prev,lastName: e.target.value.toLowerCase()}))}/>
                        <InputContainer type="text" label="Username *" onChange = {(e)=>setRegisterValues((prev)=>({...prev,username: e.target.value.toLowerCase()}))}/>
                        <InputContainer type="text" label="Email *" onChange = {(e)=>setRegisterValues((prev)=>({...prev,email: e.target.value.toLowerCase()}))}/>
                        <InputContainer type="password" label="Password *" onChange = {(e)=>setRegisterValues((prev)=>({...prev,password: e.target.value}))}/>
                        <InputContainer type="password" label="Confirm Password *" onChange = {(e)=>setRegisterValues((prev)=>({...prev,confirmPassword: e.target.value}))}/>
                        <InputContainer type="date" label="Date of Birth *" onChange = {(e)=>setRegisterValues((prev)=>({...prev,date_of_birth: e.target.value}))}/>
                        <FileInput accept=".jpg, .png, .jpeg" onChange = {(e)=>setFile(e.target.files[0])} label="Profile Photo"/>              
                        <b>{errorMsg}</b>
                        {
                            loading ?  <button disabled><img src={mode==="light"?"./assets/loading light.gif":"./assets/loading dark.gif"} 
                                                    alt="loading" className="loadingAnimation" draggable="false"/>
                                    </button>
                            : <button onClick={handleRegisterSubmission}>Signup</button>
                        }                     
                        <p>Have an account? </p>
                        <button onClick={()=>{navigate("/")}}>Login</button>
                    </form>  
                </div>
            </div>
        </div>
    )
}