import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";

function Login() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    userName: "",
    password: "",
  });

  const handleForm = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const login_url = BASE_URL + "login/";

  const handleLogin = async () => {
    setLoading(true);
    let data = new FormData();
    data.append("username", form.userName);
    data.append("password", form.password);
    await axios
      .post(login_url, data)
      .then((res) => {
        setLoading(false);
        if (res.data.status) {
          navigate("/dashboard/machinedetails");
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <>
      <Card className="loginPage col-lg-4 col-md-4 col-10">
        <Card.Body>
          <h4 className="fw-bold mb-3">Login</h4>
          <FloatingLabel
            controlId="floatingInput"
            label="Username"
            className="mb-3"
          >
            <Form.Control
              value={form.userName}
              onChange={handleForm}
              name="userName"
              type="text"
              placeholder="name@example.com"
            />
          </FloatingLabel>
          <FloatingLabel
            className="mb-4"
            controlId="floatingPassword"
            label="Password"
          >
            <Form.Control
              value={form.password}
              onChange={handleForm}
              name="password"
              type="password"
              placeholder="Password"
            />
          </FloatingLabel>
          <Button onClick={handleLogin} className="mb-2" variant="primary">
            {loading && <Spinner animation="border" size="sm" />} Login
          </Button>
        </Card.Body>
      </Card>
    </>
  );
}

export default Login;
