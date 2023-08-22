import React from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Form, Input, message } from "antd";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useParams();

  const onfinishHandler = async (values) => {
    try {
      const pass1=values.password1.trim();
      const pass2=values.password2.trim();
      values.password1=pass1;
      values.password2=pass2;
      
      dispatch(showLoading());
      const res = await axios.post(
        `${process.env.REACT_APP_URL}/api/v1/user/reset-password`,
        { values, token }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success("Password reset succesful!");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("something went wrong");
    }
  };

  return (
    <div className="form-container ">
      <Form
        layout="vertical"
        onFinish={onfinishHandler}
        className="register-form shadow-md rounded-lg w-9/12 md:w-6/12 lg:w-3/12"
      >
        <h3 className="text-center text-3xl">Reset Password </h3>

        <Form.Item label="Password" name="password">
          <Input type="password" required placeholder="Enter your password"/>
        </Form.Item>
        <Form.Item label="Confirm Password" name="password2">
          <Input type="password" required placeholder="Enter same password again"/>
        </Form.Item>

        <div className="flex justify-center">
          <button
            className="w-4/12 text-white text-base bg-blue-500 p-2 text-center rounded-md"
            type="submit"
          >
            Submit
          </button>
        </div>
      </Form>
    </div>
  );
};

export default ResetPassword;
