import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Mybutton from "../Mybutton/Mybutton";

function PieChart() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const navigate = useNavigate();

  ChartJS.register(ArcElement, Tooltip, Legend);

  // for notification
  const notify = (notification, type) =>
    toast(notification, { autoClose: 2000, theme: "colored", type: type });

  // States
  const [productionList, setProductionList] = useState([]);
  const [pieChartData, setPieChartData] = useState({
    labels: [],
    data: [],
  });
  const [filterDate, setFilterDate] = useState({
    startDate: "",
    endDate: "",
  });
  const [isReset, setIsReset] = useState(false);
  const [graphsDesignData] = useState({
    backgroundColor: [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
      "rgba(0, 128, 0, 1)",
      "rgba(255, 0, 0, 1)",
      "rgba(0, 0, 255, 1)",
      "rgba(128, 128, 0, 1)",
      "rgba(0, 128, 128, 1)",
      "rgba(128, 0, 128, 1)",
      "rgba(64, 64, 64, 1)",
      "rgba(192, 192, 192, 1)",
      "rgba(128, 0, 0, 1)",
      "rgba(0, 128, 128, 1)",
      "rgba(128, 128, 0, 1)",
      "rgba(0, 64, 128, 1)",
      "rgba(64, 0, 128, 1)",
      "rgba(128, 64, 0, 1)",
      "rgba(64, 128, 0, 1)",
    ],
  });

  // urls
  const getProductionData_url = BASE_URL + "api/productiondata/";

  // get production data
  const getProductionData = async () => {
    let header = {
      Authorization: `Token ${localStorage.getItem("token")}`,
    };

    await axios
      .get(getProductionData_url, { headers: header })
      .then((res) => {
        if (res.data.status) {
          setProductionList(res.data.data);
          handlePieChartData(res.data.data);
          setIsReset(false);
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

  //   handle Pie chart Data
  const handlePieChartData = (data) => {
    let filteredData = data.filter((item) => {
      return item.working === true;
    });

    // filter by date
    const startDateObj = new Date(filterDate.startDate);
    const endDateObj = new Date(filterDate.endDate);

    let filteredByDate = data.filter((item) => {
      return (
        new Date(item.production_Date) >= startDateObj &&
        new Date(item.production_Date) <= endDateObj
      );
    });

    if (filteredByDate.length) {
      filteredData = filteredByDate;
    }

    let pieChartArr = [];
    let uniquePieChartArr = [];

    for (let i = 0; i < filteredData.length; i++) {
      let newObj = {
        machineName: filteredData[i]?.machine,
        productionKg: filteredData[i]?.production_Kg,
      };
      pieChartArr.push(newObj);
    }

    for (let j = 0; j < pieChartArr.length; j++) {
      let unique = uniquePieChartArr.filter((element) => {
        return element.machineName === pieChartArr[j].machineName;
      });
      if (unique.length) {
        let itemIndex = uniquePieChartArr.findIndex(
          (item) => item.machineName === unique[0].machineName
        );
        uniquePieChartArr[itemIndex].productionKg =
          Number(uniquePieChartArr[itemIndex].productionKg) +
          Number(unique[0].productionKg);
      } else {
        uniquePieChartArr.push(pieChartArr[j]);
      }
    }
    let labelArr = [];
    for (let i = 0; i < uniquePieChartArr.length; i++) {
      labelArr.push(uniquePieChartArr[i].machineName);
    }

    let dataArr = [];
    for (let i = 0; i < uniquePieChartArr.length; i++) {
      dataArr.push(uniquePieChartArr[i].productionKg);
    }
    setPieChartData((prev) => ({ ...prev, labels: labelArr, data: dataArr }));
  };

  //   Handle Reset filter
  const handleResetFilter = () => {
    if (filterDate.startDate.length && filterDate.endDate.length) {
      setFilterDate({
        startDate: "",
        endDate: "",
      });
      setIsReset(true);
    }
  };

  const pieData = {
    labels: pieChartData.labels,
    datasets: [
      {
        label: "Production KG",
        data: pieChartData.data,
        backgroundColor: graphsDesignData.backgroundColor,
      },
    ],
  };

  useEffect(() => {
    getProductionData();
  }, [isReset]);

  return (
    <div className="row">
      <div className="col-12">
        <div className="row border rounded m-2 p-4">
          <div className="col-6">
            <div>
              <h5>Machine and Production KG Chart</h5>
              <div className="row mt-3">
                <div className="col-6 p-2">
                  <li className="text-secondary">From Date</li>
                  <input
                    value={filterDate.startDate}
                    onChange={(e) => {
                      setFilterDate((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }));
                    }}
                    type="date"
                    placeholder="YYYY-MM-DD"
                    className="form-control"
                  />
                </div>
                <div className="col-6 p-2">
                  <li className="text-secondary">End Date</li>
                  <input
                    value={filterDate.endDate}
                    onChange={(e) => {
                      setFilterDate((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }));
                    }}
                    type="date"
                    placeholder="YYYY-MM-DD"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="d-flex justify-content-center align-items-center mt-4 gap-2">
                <Mybutton
                  backgroundColor={"#44ce42"}
                  color={"#fff"}
                  name={"Search"}
                  handleClick={() => {
                    filterDate.startDate.length &&
                      filterDate.endDate.length &&
                      getProductionData();
                  }}
                />
                <Mybutton
                  backgroundColor={"#44ce42"}
                  color={"#fff"}
                  name={"Reset"}
                  handleClick={handleResetFilter}
                />
              </div>
            </div>
          </div>
          <div className="col-6">
            <div
              className="p-2 m-2"
              style={{ height: "400px", width: "400px" }}
            >
              <Doughnut data={pieData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PieChart;
