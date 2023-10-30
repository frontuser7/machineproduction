import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function MachineDetails() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  // for notification
  const notify = (notification, type) =>
    toast(notification, { autoClose: 2000, theme: "colored", type: type });

  const navigate = useNavigate();

  const [machineData, setMachineData] = useState([]);

  //url
  const getMachineDetails_url = BASE_URL + "api/getmachine/";

  const getMachineDetails = async () => {
    let header = {
      Authorization: `Token ${localStorage.getItem("token")}`,
    };

    await axios
      .get(getMachineDetails_url, { headers: header })
      .then((res) => {
        if (res.data.status) {
          setMachineData(res.data?.data);
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
    getMachineDetails();
  }, []);

  return (
    <>
      <Table className="mt-3" bordered responsive>
        <thead className="table-secondary">
          <tr>
            <th rowSpan={2}>Machine ID</th>
            <th rowSpan={2}>Machine Name</th>
            <th className="text-center" colSpan={3}>
              Plant
            </th>
            <th rowSpan={2}>SAP Code</th>
          </tr>
          <tr>
            <th>Plant ID</th>
            <th>Name</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {machineData &&
            machineData.map((item) => {
              return (
                <tr key={item.machineID + item.production_Date}>
                  <td>{item.machineID}</td>
                  <td>{item.machine_name}</td>
                  <td>{item?.plant?.plantID}</td>
                  <td>{item?.plant?.name}</td>
                  <td>{item?.plant?.location}</td>
                  <td>{item.sap_code}</td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </>
  );
}

export default MachineDetails;
