import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";

function ProductionList() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [productionList, setProductionList] = useState([]);

  //url
  const getProductionDetails_url = BASE_URL + "api/getProduction/";

  const getProductionDetails = async () => {
    await axios
      .get(getProductionDetails_url)
      .then((res) => {
        if (res.data.status) {
          setProductionList(res.data?.Producation);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getProductionDetails();
  }, []);
  return (
    <Table className="mt-3" bordered responsive>
      <thead className="table-secondary">
        <tr>
          <th>created_by</th>
          <th>production_Date</th>
          <th>production_Kg</th>
          <th>remark</th>
          <th>updated_by</th>
          <th>working</th>
          <th>machineID</th>
          <th>machine_name</th>
          <th>sap_code</th>
          <th>location</th>
          <th>name</th>
          <th>plantID</th>
          <th>product_name</th>
          <th>skuID</th>
          <th>weight</th>
        </tr>
      </thead>
      <tbody>
        {productionList &&
          productionList.map((item) => {
            return (
              <tr key={item?.machine?.machine_name + item.production_Date}>
                <td>{item.created_by}</td>
                <td>{item.production_Date}</td>
                <td>{item.production_Kg}</td>
                <td>{item.remark}</td>
                <td>{item.updated_by}</td>
                <td>{`${item.working}`}</td>
                <td>{item.machine?.machineID}</td>
                <td>{item.machine?.machine_name}</td>
                <td>{item.machine?.sap_code}</td>
                <td>{item.machine?.machineID}</td>
                <td>{item.machine?.machine_name}</td>
                <td>{item.machine?.sap_code}</td>
                <td>{item.sku?.product_name}</td>
                <td>{item.sku?.skuID}</td>
                <td>{item.sku?.weight}</td>
              </tr>
            );
          })}
      </tbody>
    </Table>
  );
}

export default ProductionList;
