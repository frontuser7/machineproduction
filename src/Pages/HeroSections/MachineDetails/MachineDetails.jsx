import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import axios from "axios";

function MachineDetails() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [machineData, setMachineData] = useState([]);

  //url
  const getMachineDetails_url = BASE_URL + "api/getmachine/";

  const getMachineDetails = async () => {
    await axios
      .get(getMachineDetails_url)
      .then((res) => {
        if (res.data.status) {
          setMachineData(res.data?.machine);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getMachineDetails();
  }, []);

  return (
    <Table className="mt-3" bordered responsive>
      <thead className="table-secondary">
        <tr>
          <th>machineID</th>
          <th>machine_name</th>
          <th>location</th>
          <th>name</th>
          <th>plantID</th>
          <th>sap_code</th>
        </tr>
      </thead>
      <tbody>
        {machineData &&
          machineData.map((item) => {
            return (
              <tr key={item.machineID + item.production_Date}>
                <td>{item.machineID}</td>
                <td>{item.machine_name}</td>
                <td>{item?.plant?.location}</td>
                <td>{item?.plant?.name}</td>
                <td>{item?.plant?.plantID}</td>
                <td>{item.sap_code}</td>
              </tr>
            );
          })}
      </tbody>
    </Table>
  );
}

export default MachineDetails;
