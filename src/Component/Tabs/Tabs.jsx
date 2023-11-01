import React from "react";
import "./Tabs.css";
import { useLocation, useNavigate } from "react-router-dom";

function Tabs() {
  const location = useLocation();
  const navigate = useNavigate();

  const tabsArr = [
    {
      id: 1,
      name: "Plant Details",
      path: "/dashboard/plantdetails",
    },
    {
      id: 2,
      name: "SKU Details",
      path: "/dashboard/skudetails",
    },
    {
      id: 3,
      name: "Machine Details",
      path: "/dashboard/machinedetails",
    },
    {
      id: 4,
      name: "Plant Setup",
      path: "/dashboard/plantsetup",
    },
    {
      id: 5,
      name: "Add Production Data",
      path: "/dashboard/addproduction",
    },
    {
      id: 6,
      name: "Graphical Representation",
      path: "/dashboard/graphs",
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
                location.pathname === item.path
                  ? "navTabActive"
                  : "navTabNotActive"
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
