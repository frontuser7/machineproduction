import React from "react";
import "./Mybutton.css";

function Mybutton({ name, backgroundColor, color, handleClick }) {
  const customStyle = {
    backgroundColor: backgroundColor,
    color: color,
  };
  return (
    <button style={customStyle} onClick={handleClick} className="mybtn rounded">
      {name}
    </button>
  );
}

export default Mybutton;
