import React from "react";
import InputContainer from "./inputContainer";
import './fileInput.css'
export default function FileInput(props){
    return(
        <div className="fileInput">
            <InputContainer 
            type="file" label={props.label} 
            onChange = {props.onChange}
            inputProps ={{accept:props.accept}}
            /> 
        </div>

    )
}