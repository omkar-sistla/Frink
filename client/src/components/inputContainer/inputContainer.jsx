import React, { useRef } from "react";
import "./inputContainer.css";

export default function InputContainer(props) {
  const inputRef = useRef(null);

  return (
    <div className="inputContainer">
      <input type={props.type} ref={inputRef} required onChange={props.onChange} {...props.inputProps}/>
      <label onClick={() => inputRef.current.focus()}>{props.label}</label>
    </div>
  );
}
