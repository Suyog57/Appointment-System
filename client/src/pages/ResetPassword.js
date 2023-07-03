import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, message } from "antd";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useParams();
  const onfinishHandler = async (values) => {
    console.log(values.password);
    try {
      const password = values.passsword;
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
        className="register-form"
      >
        <h3 className="text-center">Reset Password </h3>

        <Form.Item label="Password" name="password">
          <Input type="password" required />
        </Form.Item>
        <Form.Item label="Confirm Password" name="password2">
          <Input type="password" required />
        </Form.Item>

        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </Form>
    </div>
  );
};

export default ResetPassword;
