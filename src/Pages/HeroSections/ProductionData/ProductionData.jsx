import React, { useState, useEffect } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import axios from "axios";
import Mybutton from "../../../Component/Mybutton/Mybutton";

function ProductionData() {
  const [dropdownValue, setDropdownValue] = useState({
    workingStatus: "Select Working Status",
    skuId: "Select skuId",
    machineId: "Select Machine Id",
  });
  return (
    <div className="row">
      <div className="col-12 col-lg-4 col-md-6">
        <FloatingLabel
          controlId="floatingInput"
          label="production_Date"
          className="m-2"
        >
          <Form.Control
            name="production_Date"
            type="date"
            placeholder="production_Date"
          />
        </FloatingLabel>
      </div>
      <div className="col-12 col-lg-4 col-md-6">
        <FloatingLabel
          controlId="floatingInput"
          label="production_Kg"
          className="m-2"
        >
          <Form.Control
            name="production_Kg"
            type="number"
            placeholder="production_Kg"
          />
        </FloatingLabel>
      </div>
      <div className="col-12 col-lg-4 col-md-6">
        <FloatingLabel controlId="floatingInput" label="remark" className="m-2">
          <Form.Control name="remark" type="text" placeholder="remark" />
        </FloatingLabel>
      </div>
      <div className="col-12 col-lg-4 col-md-6">
        <Dropdown className="m-2">
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            {dropdownValue.skuId}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() =>
                setDropdownValue((prev) => ({ ...prev, skuId: "Yes" }))
              }
            >
              Yes
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() =>
                setDropdownValue((prev) => ({ ...prev, skuId: "Yes" }))
              }
            >
              No
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="col-12 col-lg-4 col-md-6">
        <Dropdown className="m-2">
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            {dropdownValue.machineId}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() =>
                setDropdownValue((prev) => ({ ...prev, machineId: "Yes" }))
              }
            >
              Yes
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() =>
                setDropdownValue((prev) => ({ ...prev, machineId: "Yes" }))
              }
            >
              No
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="col-12 col-lg-4 col-md-6">
        <Dropdown className="m-2">
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            {dropdownValue.workingStatus}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() =>
                setDropdownValue((prev) => ({ ...prev, workingStatus: "Yes" }))
              }
            >
              Yes
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() =>
                setDropdownValue((prev) => ({ ...prev, workingStatus: "Yes" }))
              }
            >
              No
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <hr className="mt-4" />
      <div className="text-center mt-3">
        <Mybutton name={"Submit"} backgroundColor={"#198754"} color={"#fff"} />
      </div>
    </div>
  );
}

export default ProductionData;
