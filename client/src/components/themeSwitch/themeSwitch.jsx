import React from "react";
import { useDispatch,useSelector } from "react-redux";
import { setMode } from "../../Redux/reducer";
import './themeSwitch.css'
export default function ThemeSwitch(){
    const dispatch = useDispatch();
    const mode = useSelector((state)=>state.mode);
    return(
        <div className="themeSwitch">
            <div className={`circle ${mode}`}></div>
            <i className="material-symbols-outlined" onClick={()=>dispatch(setMode())}>light_mode</i>
            <i className="material-symbols-outlined" onClick={()=>dispatch(setMode())}>dark_mode</i>
        </div>
    )
}