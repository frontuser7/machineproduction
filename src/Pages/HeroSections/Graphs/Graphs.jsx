import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import PieChart from "../../../Component/PieChart/PieChart";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Mybutton from "../../../Component/Mybutton/Mybutton";
import { useNavigate } from "react-router-dom";

function Graphs() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  // for notification
  const notify = (notification, type) =>
    toast(notification, { autoClose: 2000, theme: "colored", type: type });

  const navigate = useNavigate();

  // States
  const [machineProductionData, setMachineProductionData] = useState({
    productionKG: [],
    machineNames: [],
  });
  const [skuProductionData, setSkuProductionData] = useState({
    productionKG: [],
    skuNames: [],
  });
  const [graphColors] = useState([
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)",
  ]);
  const [filterDate, setFilterDate] = useState({
    startDate: "",
    endDate: "",
  });

  // urls
  const getMachineProduction_url = BASE_URL + "api/machine-productionkg/";
  const getSKUProduction_url = BASE_URL + "api/sku-productionkg/";

  // get machine production data
  const handleMachineProduction = async (startDate, endDate) => {
    let header = {
      Authorization: `Token ${localStorage.getItem("token")}`,
    };

    await axios
      .get(getMachineProduction_url, {
        headers: header,
        params: {
          start_date: startDate || "",
          end_date: endDate || "",
        },
      })
      .then((res) => {
        if (res.data.status) {
          let machineNames = [];
          let productionKGs = [];
          for (let i = 0; i < res.data?.data.length; i++) {
            machineNames.push(res.data?.data[i]?.machine_name);
            productionKGs.push(res.data?.data[i]?.production_kg_sum);
          }
          setMachineProductionData((prev) => ({
            ...prev,
            machineNames: machineNames,
            productionKG: productionKGs,
          }));
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

  // get SKU production data
  const handleSKUProduction = async (startDate, endDate) => {
    let header = {
      Authorization: `Token ${localStorage.getItem("token")}`,
    };

    await axios
      .get(getSKUProduction_url, {
        headers: header,
        params: {
          start_date: startDate || "",
          end_date: endDate || "",
        },
      })
      .then((res) => {
        if (res.data.status) {
          let skuNames = [];
          let productionKGs = [];
          for (let i = 0; i < res.data?.data.length; i++) {
            skuNames.push(res.data?.data[i]?.product_name);
            productionKGs.push(res.data?.data[i]?.production_kg_sum);
          }
          setSkuProductionData((prev) => ({
            ...prev,
            skuNames: skuNames,
            productionKG: productionKGs,
          }));
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

  const handleReset = () => {
    setFilterDate({
      startDate: "",
      endDate: "",
    });
    handleMachineProduction();
    handleSKUProduction();
  };

  useEffect(() => {
    handleMachineProduction();
    handleSKUProduction();
  }, []);

  return (
    <div className="row text-center">
      <div className="col-12">
        <div className="row">
          <div className="col-4 p-2">
            <FloatingLabel controlId="floatingInput" label="Start Date">
              <Form.Control
                type="date"
                placeholder="Start Date"
                value={filterDate.startDate}
                onChange={(e) => {
                  setFilterDate((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }));
                }}
              />
            </FloatingLabel>
          </div>
          <div className="col-4 p-2">
            <FloatingLabel controlId="floatingInput" label="End Date">
              <Form.Control
                value={filterDate.endDate}
                onChange={(e) => {
                  setFilterDate((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }));
                }}
                type="date"
                placeholder="End Date"
              />
            </FloatingLabel>
          </div>
          <div className="col-4 mt-auto p-2 gap-2 d-flex">
            <Mybutton
              backgroundColor={"#44ce42"}
              color={"#fff"}
              name={"Search"}
              handleClick={() => {
                if (filterDate.startDate.length && filterDate.endDate.length) {
                  handleMachineProduction(
                    filterDate.startDate,
                    filterDate.endDate
                  );
                  handleSKUProduction(filterDate.startDate, filterDate.endDate);
                }
              }}
            />
            <Mybutton
              backgroundColor={"#44ce42"}
              color={"#fff"}
              name={"Reset"}
              handleClick={handleReset}
            />
          </div>
        </div>
      </div>
      <div className="col-6 col-lg-4">
        <PieChart
          heading={"Production KG against Machines"}
          productionKGData={machineProductionData.productionKG}
          labels={machineProductionData.machineNames}
          labelName={"Production KG"}
          colors={graphColors}
        />
      </div>
      <div className="col-6 col-lg-4">
        <PieChart
          heading={"Production KG against SKU"}
          productionKGData={skuProductionData.productionKG}
          labels={skuProductionData.skuNames}
          labelName={"Production KG"}
          colors={graphColors}
        />
      </div>
    </div>
  );
}

export default Graphs;
