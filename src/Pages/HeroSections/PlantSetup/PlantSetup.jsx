import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CustomLoader from "../../../Component/Loader/CustomLoader";

function PlantSetup() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  // for notification
  const notify = (notification, type) =>
    toast(notification, { autoClose: 2000, theme: "colored", type: type });

  const navigate = useNavigate();

  const [plantSetup, setPlantSetup] = useState([]);
  const [loader, setLoader] = useState(false);

  //url
  const getPlantSetupDetails_url = BASE_URL + "api/getplantsetup/";

  const getPlantSetupDetails = async () => {
    setLoader(true);
    let header = {
      Authorization: `Token ${localStorage.getItem("token")}`,
    };

    await axios
      .get(getPlantSetupDetails_url, { headers: header })
      .then((res) => {
        if (res.data.status) {
          setPlantSetup(res.data?.data);
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
    getPlantSetupDetails();
  }, []);
  return (
    <>
      {loader ? (
        <CustomLoader />
      ) : (
        <Table className="mt-3" bordered responsive>
          <thead className="table-secondary">
            <tr>
              <th rowSpan={3}>Setup ID</th>
              <th colSpan={6} className="text-center">
                Machine
              </th>
              <th colSpan={3} className="text-center">
                SKU
              </th>
            </tr>
            <tr>
              <th rowSpan={2}>MAchine ID</th>
              <th rowSpan={2}>Machine NAme</th>
              <th rowSpan={2}>SAP Code</th>
              <th colSpan={3} className="text-center">
                Plant
              </th>
              <th rowSpan={2}>SKU ID</th>
              <th rowSpan={2}>Product Name</th>
              <th rowSpan={2}>Weight</th>
            </tr>
            <tr>
              <th>Plant ID</th>
              <th>Name</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {plantSetup &&
              plantSetup.map((item) => {
                return (
                  <tr key={item.setupId}>
                    <td>{item.setupId}</td>
                    <td>{item?.machine?.machineID}</td>
                    <td>{item?.machine?.machine_name}</td>
                    <td>{item?.machine?.sap_code}</td>
                    <td>{item?.machine?.plant?.plantID}</td>
                    <td>{item?.machine?.plant?.name}</td>
                    <td>{item?.machine?.plant?.location}</td>
                    <td>{item?.sku?.skuID}</td>
                    <td>{item?.sku?.product_name}</td>
                    <td>{item?.sku?.weight}</td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      )}
    </>
  );
}

export default PlantSetup;
