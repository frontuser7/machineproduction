import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Mybutton from "../Mybutton/Mybutton";
import Dropdown from "react-bootstrap/Dropdown";

function PolarChart() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const navigate = useNavigate();

  ChartJS.register(ArcElement, Tooltip, Legend);

  // for notification
  const notify = (notification, type) =>
    toast(notification, { autoClose: 2000, theme: "colored", type: type });

  // States
  const [productionList, setProductionList] = useState([]);
  const [pieChartData, setPieChartData] = useState({
    labels: ["Working", "Not Working"],
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
  const [machineList, setMachineList] = useState([]);
  const [dropdownValue, setDropdownValue] = useState(
    machineList[0]?.machineName || "Select Machine"
  );
  const [showDropdownMenu, setShowDropdownMenu] = useState(true);

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
      data = filteredByDate;
    }

    let pieChartArr = [];
    let uniquePieChartArr = [];

    for (let i = 0; i < data.length; i++) {
      let newObj = {
        machineName: data[i]?.machine,
        productionKg: data[i]?.production_Kg,
        working: data[i]?.working,
        workingTrueKG: data[i]?.working ? data[i]?.production_Kg : 0,
        workingFalseKG: data[i]?.working ? 0 : data[i]?.production_Kg,
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
        if (pieChartArr[j].working) {
          uniquePieChartArr[itemIndex].workingTrueKG =
            Number(uniquePieChartArr[itemIndex].workingTrueKG) +
            Number(pieChartArr[j].productionKg);
        } else {
          uniquePieChartArr[itemIndex].workingFalseKG =
            Number(uniquePieChartArr[itemIndex].workingFalseKG) +
            Number(pieChartArr[j].productionKg);
        }
      } else {
        let newObj = {
          machineName: pieChartArr[j]?.machineName,
          workingTrueKG: pieChartArr[j]?.workingTrueKG,
          workingFalseKG: pieChartArr[j]?.workingFalseKG,
        };
        uniquePieChartArr.push(newObj);
      }
    }
    setMachineList(uniquePieChartArr);
  };

  const handleDropdownChange = (name) => {
    let selectedMachineData = machineList.filter((item) => {
      return item.machineName === name;
    });
    setPieChartData((prev) => ({
      ...prev,
      labels: ["Working", "Not Working"],
      data: [
        selectedMachineData[0]?.workingTrueKG,
        selectedMachineData[0]?.workingFalseKG,
      ],
    }));
  };

  //   Handle Reset filter
  const handleResetFilter = () => {
    if (filterDate.startDate.length && filterDate.endDate.length) {
      setFilterDate({
        startDate: "",
        endDate: "",
      });
      setIsReset(true);
      setDropdownValue("Select Machine");
      setShowDropdownMenu(true);
      setPieChartData((prev) => ({
        ...prev,
        labels: [],
        data: [],
      }));
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
              <h5>Production KG against machine working status </h5>
              <div className="row mt-3">
                <div className="col-4 p-2">
                  <li className="text-secondary">From Date</li>
                  <input
                    value={filterDate.startDate}
                    onChange={(e) => {
                      setFilterDate((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }));
                      setDropdownValue("Select Machine");
                    }}
                    type="date"
                    placeholder="YYYY-MM-DD"
                    className="form-control"
                  />
                </div>
                <div className="col-4 p-2">
                  <li className="text-secondary">End Date</li>
                  <input
                    value={filterDate.endDate}
                    onChange={(e) => {
                      setFilterDate((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }));
                      setDropdownValue("Select Machine");
                      setShowDropdownMenu(false);
                    }}
                    type="date"
                    placeholder="YYYY-MM-DD"
                    className="form-control"
                  />
                </div>
                <div className="col-4 p-2 d-flex align-items-end">
                  <Mybutton
                    backgroundColor={"#44ce42"}
                    color={"#fff"}
                    name={"Search"}
                    handleClick={() => {
                      filterDate.startDate.length &&
                        filterDate.endDate.length &&
                        getProductionData();
                      setShowDropdownMenu(true);
                    }}
                  />
                </div>
                {showDropdownMenu && (
                  <div className="col-12 text-center p-2">
                    <li className="text-secondary">Select Machine</li>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="secondary"
                        className="dropdowntext"
                      >
                        {dropdownValue}
                      </Dropdown.Toggle>

                      <Dropdown.Menu className="dropdowntext">
                        {machineList.length &&
                          machineList.map((machine) => {
                            return (
                              <Dropdown.Item
                                key={machine?.machineName}
                                onClick={() => {
                                  setDropdownValue(machine?.machineName);
                                  handleDropdownChange(machine?.machineName);
                                }}
                              >
                                {machine?.machineName}
                              </Dropdown.Item>
                            );
                          })}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                )}
              </div>
              <div className="d-flex justify-content-center align-items-center mt-4 gap-2">
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
              <Pie data={pieData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PolarChart;
