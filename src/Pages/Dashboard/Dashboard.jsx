import React from "react";
import Navbar from "../../Component/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import Tabs from "../../Component/Tabs/Tabs";

function Dashboard() {
  return (
    <>
      <Navbar />
      <Tabs />
      <Outlet />
    </>
  );
}

export default Dashboard;
