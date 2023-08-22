import React from "react";
import "../styles/RegisterStyles.css";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onfinishHandler = async (values) => {
    try {
      const email = values.email.trim();
      const password = values.password.trim();
      values.email = email;
      values.password = password;

      dispatch(showLoading());
      const res = await axios.post(
        `${process.env.REACT_APP_URL}/api/v1/user/login`,
        values
      );

      dispatch(hideLoading());

      if (res.data.success) {
        window.location.reload();

        localStorage.setItem("token", res.data.token);
        message.success("Login Successful!");
        navigate(`/`);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("something went wrong");
    }
  };

  return (
    <div className="form-container min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat">
      <Form
        layout="vertical"
        onFinish={onfinishHandler}
        className="register-form shadow-md rounded-lg w-9/12 md:w-6/12 lg:w-3/12"
      >
        <h3 className="text-center text-3xl">Login Form </h3>

        <Form.Item className="text-xl" label="Email" name="email">
          <Input type="email" required placeholder="Enter your email" />
        </Form.Item>
        <Form.Item className="text-xl" label="Password" name="password">
          <Input type="password" required placeholder="Enter your password" />
        </Form.Item>

        <div className="flex justify-center">
          <button
            className="w-4/12 text-white text-base bg-blue-500 p-2 text-center rounded-md"
            type="submit"
          >
            Login
          </button>
        </div>
        <br />

        <Link to={`/register`} className="m-2 mt-4 text-sm underline">
          Don't have an account?
        </Link>
        <br className="md:hidden" />
        <Link to={`/forget-password`} className="m-2 mt-4 underline">
          Forgot Password?
        </Link>
      </Form>
    </div>
  );
};

export default Login;
