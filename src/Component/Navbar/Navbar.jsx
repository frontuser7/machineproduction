import React from "react";
import "./Navbar.css";
import Mybutton from "../Mybutton/Mybutton";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };
  return (
    <div className="bg-primary d-flex justify-content-between align-items-center p-2">
      <h2 className="text-white">Dashboard</h2>
      <Mybutton
        name={"Logout"}
        backgroundColor={"#FFF5E0"}
        handleClick={handleClick}
      />
    </div>
  );
}

export default Navbar;
