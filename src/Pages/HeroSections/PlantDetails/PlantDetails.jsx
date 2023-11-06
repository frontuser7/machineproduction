import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CustomLoader from "../../../Component/Loader/CustomLoader";

function PlantDetails() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  // for notification
  const notify = (notification, type) =>
    toast(notification, { autoClose: 2000, theme: "colored", type: type });

  const navigate = useNavigate();

  const [plantData, setPlantData] = useState([]);
  const [loader, setLoader] = useState(false);

  //url
  const getPlantDetails_url = BASE_URL + "api/getplant/";

  const getPlantDetails = async () => {
    setLoader(true);
    let header = {
      Authorization: `Token ${localStorage.getItem("token")}`,
    };

    await axios
      .get(getPlantDetails_url, { headers: header })
      .then((res) => {
        if (res.data.status) {
          setPlantData(res.data?.data);
          setLoader(false);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.status === 401) {
          notify("Unathorized user", "error");
          navigate("/");
        }
      });
  };

  useEffect(() => {
    getPlantDetails();
  }, []);
  return (
    <>
      {loader ? (
        <CustomLoader />
      ) : (
        <Table className="mt-3" bordered responsive>
          <thead className="table-secondary">
            <tr>
              <th>Plant ID</th>
              <th>Name</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {plantData &&
              plantData.map((item) => {
                return (
                  <tr key={item.plantID + item.name}>
                    <td>{item.plantID}</td>
                    <td>{item.name}</td>
                    <td>{item.location}</td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      )}
    </>
  );
}

export default PlantDetails;
