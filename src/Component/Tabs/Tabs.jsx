import React from "react";
import "./Tabs.css";
import { useLocation, useNavigate } from "react-router-dom";

function Tabs() {
  const location = useLocation();
  const navigate = useNavigate();

  const tabsArr = [
    {
      id: 1,
      name: "Machine Details",
      path: "/dashboard/machinedetails",
    },
    {
      id: 2,
      name: "Add Production Data",
      path: "/dashboard/addproduction",
    },
    {
      id: 3,
      name: "Production List",
      path: "/dashboard/productionlist",
    },
  ];
  return (
    <div className="my-3 d-flex align-items-center navTabContainer">
      {tabsArr &&
        tabsArr.map((item) => {
          return (
            <div
              key={item.id}
              onClick={() => {
                navigate(item.path);
              }}
              className={`navTab p-2 m-1 ${
                location.pathname === item.path ? "navTabActive" : ""
              }`}
            >
              {item.name}
            </div>
          );
        })}
    </div>
  );
}

export default Tabs;
