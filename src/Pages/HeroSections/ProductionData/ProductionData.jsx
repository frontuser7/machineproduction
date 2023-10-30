import React, { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Mybutton from "../../../Component/Mybutton/Mybutton";
import MultiSelect from "../../../Component/MultiSelect/MultiSelect";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";

function ProductionData() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  // for notification
  const notify = (notification, type) =>
    toast(notification, { autoClose: 2000, theme: "colored", type: type });

  const navigate = useNavigate();

  const [form, setForm] = useState({
    machine: {
      id: null,
      name: "Select Machine",
    },
    productionDate: "",
    productionKg: "",
    batchNo: "",
    working: false,
    remark: "",
  });
  const [state, setState] = useState([]);
  const [productionList, setProductionList] = useState([]);
  const [apiCall, setApiCall] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [skuData, setSkuData] = useState([]);
  const [machineData, setMachineData] = useState([]);
  const [selectedSKU, setSelectedSku] = useState([]);

  const handleForm = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // urls
  const getMachineDetails_url = BASE_URL + "api/getplantsetup/";
  const postProductionData_url = BASE_URL + "api/productiondata/";
  const getProductionData_url = BASE_URL + "api/productiondata/";

  // get machine and sku Data
  const getData = async () => {
    let header = {
      Authorization: `Token ${localStorage.getItem("token")}`,
    };

    await axios
      .get(getMachineDetails_url, { headers: header })
      .then((res) => {
        if (res.data.status) {
          setState(res.data?.data);

          const key = "machineID";

          const arrayUniqueByKey = [
            ...new Map(
              res.data?.data.map((item) => [item.machine[key], item])
            ).values(),
          ];
          setMachineData(arrayUniqueByKey);
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

  // handle sku select against machine id
  const handleSelect = (machine) => {
    setForm((prev) => ({
      ...prev,
      machine: {
        id: machine?.machine?.machineID,
        name: machine?.machine?.machine_name,
      },
    }));
    let id = machine?.machine?.machineID;

    let filteredState = state.filter((item) => {
      return item?.machine?.machineID === id;
    });

    let skuArr = [];
    for (let i = 0; i < filteredState.length; i++) {
      let newObj = {
        label: filteredState[i]?.sku?.product_name,
        value: filteredState[i]?.sku?.skuID,
      };
      skuArr.push(newObj);
    }
    setSkuData(skuArr);
  };

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

  // getSelected SKU
  const selectedSku = (data) => {
    let idsArr = [];
    for (let i = 0; i < data.length; i++) {
      idsArr.push(data[i].value);
    }
    setSelectedSku(idsArr);
  };

  // post api
  const handleSubmit = async () => {
    if (
      !form.batchNo.length ||
      !form.productionDate.length ||
      !form.productionKg.length ||
      !form.remark.length ||
      !selectedSKU.length
    ) {
      return notify("All fields are mandatory", "info");
    }

    let header = {
      Authorization: `Token ${localStorage.getItem("token")}`,
    };

    let data = new FormData();
    data.append("production_Date", form.productionDate);
    data.append("production_Kg", form.productionKg);
    data.append("machine", form.machine.id);
    data.append("remark", form.remark);
    data.append("batchNo", form.batchNo);
    data.append("working", form.working);
    data.append("skudata", JSON.stringify(selectedSKU));

    await axios
      .post(postProductionData_url, data, { headers: header })
      .then((res) => {
        if (res.data.status) {
          setForm({
            machine: {
              id: null,
              name: "Select Machine",
            },
            productionDate: "",
            productionKg: "",
            batchNo: "",
            working: false,
            remark: "",
          });
          setIsEmpty(true);
          setApiCall(true);
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

  // download excel
  const downloadExcel = () => {
    function flattenSkillsArray(arr) {
      return arr.map((item) => {
        const flattenedItem = { ...item };
        if (item.skudata) {
          for (let i = 0; i < item.skudata.length; i++) {
            flattenedItem[`skuID_${i + 1}`] = item.skudata[i].skuID;
            flattenedItem[`product_name${i + 1}`] =
              item.skudata[i].product_name;
            flattenedItem[`weight${i + 1}`] = item.skudata[i].weight;
          }
        }
        delete flattenedItem.skudata;
        return flattenedItem;
      });
    }

    const flattenedData = flattenSkillsArray(productionList);

    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "DataSheet.xlsx");
  };

  // handle Filter by date

  const handleFilter = (date) => {
    console.log(date);
    let filteredData = productionList.filter((item) => {
      return item.production_Date === date;
    });
    if (filteredData.length) {
      setProductionList(filteredData);
    } else {
      getProductionData();
      notify("Data not available for this date", "error");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getProductionData();
  }, [apiCall]);

  return (
    <>
      <Table className="mt-3" bordered>
        <thead className="table-secondary">
          <tr>
            <th>Machine Name</th>
            <th style={{ width: "200px" }}>SKU Name</th>
            <th>Production Name</th>
            <th>Production Kg</th>
            <th>Batch No</th>
            <th>Working</th>
            <th>Remark</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Dropdown>
                <Dropdown.Toggle variant="white" className="dropdowntext">
                  {form.machine.name}
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropdowntext">
                  {machineData.length &&
                    machineData.map((machine) => {
                      return (
                        <Dropdown.Item
                          key={machine?.machine?.machineID}
                          onClick={() => {
                            handleSelect(machine);
                          }}
                        >
                          {machine?.machine?.machine_name}
                        </Dropdown.Item>
                      );
                    })}
                </Dropdown.Menu>
              </Dropdown>
            </td>
            <td>
              <MultiSelect
                isEmpty={isEmpty}
                placeholderName={"Select SKU"}
                data={skuData}
                selectedSKU={selectedSku}
              />
            </td>
            <td>
              <input
                value={form.productionDate}
                onChange={handleForm}
                name="productionDate"
                type="date"
                placeholder="YYYY-MM-DD"
                className="form-control productiondate"
              />
            </td>
            <td>
              <input
                value={form.productionKg}
                onChange={handleForm}
                name="productionKg"
                type="number"
                className="form-control"
              />
            </td>
            <td>
              <input
                value={form.batchNo}
                onChange={handleForm}
                name="batchNo"
                type="text"
                className="form-control"
              />
            </td>
            <td>
              <div className="d-flex align-items-center gap-2 fs-6">
                <Form.Check
                  onClick={() => {
                    setForm((prev) => ({ ...prev, working: true }));
                  }}
                  inline
                  label="Yes"
                  name="group1"
                  type={"radio"}
                />
                <Form.Check
                  defaultChecked
                  inline
                  label="No"
                  name="group1"
                  type={"radio"}
                  onClick={() => {
                    setForm((prev) => ({ ...prev, working: false }));
                  }}
                />
              </div>
            </td>
            <td>
              <input
                value={form.remark}
                onChange={handleForm}
                name="remark"
                type="text"
                className="form-control"
              />
            </td>
            <td>
              <Mybutton
                name={"Submit"}
                backgroundColor={"#44ce42"}
                color={"#fff"}
                handleClick={handleSubmit}
              />
            </td>
          </tr>
        </tbody>
      </Table>

      <hr />
      <div className="d-flex align-items-center justify-content-center">
        <h4 className="ms-auto">Production Data List</h4>
        <div className="ms-auto me-2">
          <Mybutton
            name={"Download in Excel"}
            color={"#fff"}
            backgroundColor={"#44ce42"}
            handleClick={downloadExcel}
          />
        </div>
      </div>
      <div className="my-3 ms-2">
        <div className="my-2 ms-2 text-secondary">Filter By Date</div>
        <div className="d-flex justify-content-start align-items-center gap-2">
          <div>
            <input
              onChange={(e) => {
                handleFilter(e.target.value);
              }}
              type="date"
              placeholder="YYYY-MM-DD"
              className="form-control productiondate"
            />
          </div>
          <Mybutton
            name={"Today"}
            handleClick={() => {
              handleFilter(moment(new Date()).format("YYYY-MM-DD"));
            }}
          />
          <Mybutton
            handleClick={() => {
              handleFilter(moment().subtract(1, "day").format("YYYY-MM-DD"));
            }}
            name={"Yesturday"}
          />
          <Mybutton name={"All"} handleClick={getProductionData} />
        </div>
      </div>
      <Table className="mt-3" bordered>
        <thead className="table-secondary">
          <tr>
            <th rowSpan={2}>Production Id</th>
            <th rowSpan={2}>Created By</th>
            <th rowSpan={2}>Created Time</th>
            <th rowSpan={2}>Batch No</th>
            <th rowSpan={2}>Production Date</th>
            <th rowSpan={2}>Production Kg</th>
            <th rowSpan={2}>Machine</th>
            <th colSpan={3} className="text-center">
              SKU Data
            </th>
            <th rowSpan={2}>Working</th>
            <th rowSpan={2}>Remark</th>
          </tr>
          <tr>
            <th>SKU Id</th>
            <th>Product Name</th>
            <th>Weight</th>
          </tr>
        </thead>
        {productionList.length ? (
          <tbody>
            {productionList &&
              productionList.map((item) => {
                return (
                  <tr key={item.productionId}>
                    <td>{item.productionId}</td>
                    <td>{item.created_by}</td>
                    <td>{item.createdtime}</td>
                    <td>{item.batchNo}</td>
                    <td>{item.production_Date}</td>
                    <td>{item.production_Kg}</td>
                    <td>{item.machine}</td>
                    <td>
                      {item.skudata.length &&
                        item.skudata.map((skuItem) => {
                          return <div key={skuItem.skuID}>{skuItem.skuID}</div>;
                        })}
                    </td>
                    <td>
                      {item.skudata.length &&
                        item.skudata.map((skuItem) => {
                          return (
                            <div key={skuItem.product_name}>
                              {skuItem.product_name}
                            </div>
                          );
                        })}
                    </td>
                    <td>
                      {item.skudata.length &&
                        item.skudata.map((skuItem) => {
                          return (
                            <div key={skuItem.weight}>{skuItem.weight}</div>
                          );
                        })}
                    </td>
                    <td>{item.working ? "Yes" : "No"}</td>
                    <td>{item.remark}</td>
                  </tr>
                );
              })}
          </tbody>
        ) : (
          ""
        )}
      </Table>
    </>
  );
}

export default ProductionData;
