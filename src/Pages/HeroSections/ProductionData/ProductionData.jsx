import React, { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import DropdownButton from "react-bootstrap/DropdownButton";
import Mybutton from "../../../Component/Mybutton/Mybutton";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
    sku: {
      id: null,
      name: "Select SKU",
    },
    productionDate: "",
    productionKg: "",
    batchNo: "",
    working: true,
    remark: "Working",
  });
  const [state, setState] = useState([]);
  const [productionList, setProductionList] = useState([]);
  const [skuData, setSkuData] = useState([]);
  const [machineData, setMachineData] = useState([]);
  const [filterDates, setFilterDates] = useState({
    startDate: "",
    endDate: "",
  });
  const [isDisable, setIsDisable] = useState(false);

  const handleForm = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle disable based on working status
  const handleDisable = (working) => {
    setIsDisable(!working);
    setForm((prev) => ({ ...prev, batchNo: "", productionKg: "" }));
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
        name: filteredState[i]?.sku?.product_name,
        id: filteredState[i]?.sku?.skuID,
      };
      skuArr.push(newObj);
    }
    setSkuData(skuArr);
  };

  // get production data
  const getProductionData = async (startDate, endDate) => {
    let header = {
      Authorization: `Token ${localStorage.getItem("token")}`,
    };

    await axios
      .get(getProductionData_url, {
        headers: header,
        params: {
          start_date: startDate || "",
          end_date: endDate || "",
        },
      })
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
  // const selectedSku = (data) => {
  //   let idsArr = [];
  //   for (let i = 0; i < data.length; i++) {
  //     idsArr.push(data[i].value);
  //   }
  //   setSelectedSku(idsArr);
  // };

  // post api
  const handleSubmit = async () => {
    if (
      !form.productionDate.length ||
      !form.batchNo.length ||
      !form.machine.id ||
      !form.sku.id ||
      !form.remark.length
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
    data.append("working", form.working === true ? "yes" : "no");
    data.append("skudata", JSON.stringify([form.sku.id]));

    await axios
      .post(postProductionData_url, data, { headers: header })
      .then((res) => {
        if (res.data.status) {
          setForm({
            machine: {
              id: null,
              name: "Select Machine",
            },
            sku: {
              id: null,
              name: "Select SKU",
            },
            productionDate: "",
            productionKg: "",
            batchNo: "",
            working: false,
            remark: "",
          });
          setSkuData([]);
          getProductionData();
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
            flattenedItem[`skuID`] = item.skudata[i].skuID;
            flattenedItem[`product_name`] = item.skudata[i].product_name;
            flattenedItem[`weight`] = item.skudata[i].weight;
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

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getProductionData();
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-6 col-lg-4 col-md-4 px-2 my-2">
          <InputGroup>
            <DropdownButton variant="outline-secondary" title="Select Machine">
              {machineData.length &&
                machineData.map((machine) => {
                  return (
                    <Dropdown.Item
                      key={machine?.machine?.machineID}
                      onClick={() => {
                        handleSelect(machine);
                        setForm((prev) => ({
                          ...prev,
                          sku: { name: "Select SKU", id: null },
                        }));
                      }}
                    >
                      {machine?.machine?.machine_name}
                    </Dropdown.Item>
                  );
                })}
            </DropdownButton>
            <Form.Control
              readOnly
              aria-label="Text input with dropdown button"
              value={form.machine.name}
            />
          </InputGroup>
        </div>
        <div className="col-6 col-lg-4 col-md-4 px-2 my-2">
          <InputGroup>
            <DropdownButton variant="outline-secondary" title="SKU Name">
              {skuData.length &&
                skuData.map((sku) => {
                  return (
                    <Dropdown.Item
                      key={sku?.id}
                      onClick={() => {
                        setForm((prev) => ({ ...prev, sku: sku }));
                      }}
                    >
                      {sku?.name}
                    </Dropdown.Item>
                  );
                })}
            </DropdownButton>
            <Form.Control
              readOnly
              aria-label="Text input with dropdown button"
              value={form.sku.name}
            />
          </InputGroup>
        </div>
        <div className="col-6 col-lg-4 col-md-4 px-2 my-2">
          <div className="row">
            <div className="col-6 px-1">
              <InputGroup>
                <InputGroup.Radio
                  defaultChecked
                  onClick={() => {
                    setForm((prev) => ({
                      ...prev,
                      working: true,
                      remark: "Working",
                    }));
                    handleDisable(true);
                  }}
                  name="workingStatus"
                />
                <Form.Control readOnly placeholder="Working" />
              </InputGroup>
            </div>
            <div className="col-6 px-1">
              <InputGroup>
                <InputGroup.Radio
                  onClick={() => {
                    setForm((prev) => ({
                      ...prev,
                      working: false,
                      remark: "",
                    }));
                    handleDisable(false);
                  }}
                  name="workingStatus"
                />
                <Form.Control readOnly placeholder="Not Working" />
              </InputGroup>
            </div>
          </div>
        </div>
        {/* <div
          className="col-6 col-lg-4 col-md-4 px-2"
          style={{ fontSize: "12px" }}
        >
          <label className="label m-2">SKU Name</label>
          <div>
            <MultiSelect
              isEmpty={isEmpty}
              placeholderName={"Select SKU"}
              data={skuData}
              selectedSKU={selectedSku}
            />
          </div>
        </div> */}
        <div className="col-6 col-lg-4 col-md-4 px-2 my-2">
          <div className="input-group">
            <span className="input-group-text" id="basic-addon1">
              Production date
            </span>
            <input
              type="date"
              value={form.productionDate}
              onChange={handleForm}
              name="productionDate"
              placeholder="YYYY-MM-DD"
              className="form-control"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
        </div>
        <div className="col-6 col-lg-4 col-md-4 px-2 my-2">
          <div className="input-group">
            <span className="input-group-text" id="basic-addon1">
              Production KG
            </span>
            <input
              disabled={isDisable}
              value={form.productionKg}
              onChange={handleForm}
              name="productionKg"
              type="number"
              placeholder="in kg"
              className="form-control"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
        </div>
        <div className="col-6 col-lg-4 col-md-4 px-2 my-2">
          <div className="input-group">
            <span className="input-group-text" id="basic-addon1">
              Batch No
            </span>
            <input
              value={form.batchNo}
              onChange={handleForm}
              name="batchNo"
              type="text"
              placeholder="Enter Batch No"
              className="form-control"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
        </div>
        <div className="col-6 col-lg-4 col-md-4 px-2 my-2">
          <div className="input-group">
            <span className="input-group-text" id="basic-addon1">
              Remark
            </span>
            <input
              value={form.remark}
              onChange={handleForm}
              name="remark"
              type="text"
              placeholder="Enter Remark"
              className="form-control"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
        </div>
        <div className="text-center p-2 mt-2">
          <Mybutton
            name={"Submit"}
            backgroundColor={"#44ce42"}
            color={"#fff"}
            handleClick={handleSubmit}
          />
        </div>
      </div>
      {/* <div>
        <Table className="mt-3" bordered responsive>
          <thead className="table-secondary">
            <tr>
              <th>Machine Name</th>
              <th style={{ width: "200px" }}>SKU Name</th>
              <th>Production Date</th>
              <th>Production Kg</th>
              <th>Batch No</th>
              <th>Working</th>
              <th>Remark</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td>
                <div style={{ width: "200px" }}>
                  <MultiSelect
                    isEmpty={isEmpty}
                    placeholderName={"Select SKU"}
                    data={skuData}
                    selectedSKU={selectedSku}
                  />
                </div>
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
                  disabled={isDisable}
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
                    defaultChecked
                    onClick={() => {
                      setForm((prev) => ({ ...prev, working: true }));
                      handleDisable(true);
                    }}
                    inline
                    label="Yes"
                    name="group1"
                    type={"radio"}
                  />
                  <Form.Check
                    inline
                    label="No"
                    name="group1"
                    type={"radio"}
                    onClick={() => {
                      setForm((prev) => ({ ...prev, working: false }));
                      handleDisable(false);
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
      </div> */}

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
      <div className="my-3 mx-2">
        <li className="my-2 ms-2 text-dark">Filter By Date</li>
        <div className="d-flex justify-content-start align-items-end gap-2 flex-wrap">
          <div>
            <h6 className="text-secondary mb-2" style={{ fontSize: "13px" }}>
              From Date
            </h6>
            <input
              onChange={(e) => {
                setFilterDates((prev) => ({
                  ...prev,
                  startDate: e.target.value,
                }));
              }}
              value={filterDates.startDate}
              type="date"
              placeholder="YYYY-MM-DD"
              className="form-control productiondate"
            />
          </div>
          <div>
            <h6 className="text-secondary mb-2" style={{ fontSize: "13px" }}>
              To Date
            </h6>
            <input
              onChange={(e) => {
                setFilterDates((prev) => ({
                  ...prev,
                  endDate: e.target.value,
                }));
              }}
              value={filterDates.endDate}
              type="date"
              placeholder="YYYY-MM-DD"
              className="form-control productiondate"
            />
          </div>
          {/* <Mybutton
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
          /> */}
          <Mybutton
            name={"Search"}
            handleClick={() => {
              if (filterDates.startDate.length && filterDates.endDate.length) {
                getProductionData(filterDates.startDate, filterDates.endDate);
              }
            }}
          />
          <Mybutton
            name={"Reset Filter"}
            handleClick={() => {
              getProductionData();
              setFilterDates({
                startDate: "",
                endDate: "",
              });
            }}
          />
        </div>
      </div>
      <Table className="mt-3" bordered responsive>
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
