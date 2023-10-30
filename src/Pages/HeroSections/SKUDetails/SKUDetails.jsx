import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function SKUDetails() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  // for notification
  const notify = (notification, type) =>
    toast(notification, { autoClose: 2000, theme: "colored", type: type });

  const navigate = useNavigate();

  const [skuData, setSKUData] = useState([]);

  //url
  const getSKUDetails_url = BASE_URL + "api/getsku/";

  const getSKUDetails = async () => {
    let header = {
      Authorization: `Token ${localStorage.getItem("token")}`,
    };

    await axios
      .get(getSKUDetails_url, { headers: header })
      .then((res) => {
        if (res.data.status) {
          setSKUData(res.data?.data);
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
    getSKUDetails();
  }, []);
  return (
    <Table className="mt-3" bordered responsive>
      <thead className="table-secondary">
        <tr>
          <th>SKU ID</th>
          <th>Product Name</th>
          <th>Weight</th>
        </tr>
      </thead>
      <tbody>
        {skuData &&
          skuData.map((item) => {
            return (
              <tr key={item.skuID + item.product_name}>
                <td>{item.skuID}</td>
                <td>{item.product_name}</td>
                <td>{item.weight}</td>
              </tr>
            );
          })}
      </tbody>
    </Table>
  );
}

export default SKUDetails;
