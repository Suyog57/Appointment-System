import React from "react";
import { Form, Input, message } from "antd";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";

const ForgetPassword = () => {
  const dispatch = useDispatch();

  const onfinishHandler = async (values) => {
    try {
      dispatch(showLoading());

      const email = values.email.trim();
      values.email = email;

      const res = await axios.post(
        `${process.env.REACT_APP_URL}/api/v1/user/forget-password`,
        values
      );
      dispatch(hideLoading());

      if (res.data.success) {
        message.success("Mail sent successfully!");
        console.log(res.data);
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
        className="register-form shadow-md rounded-lg w-3/12"
      >
        <h3 className="text-center text-3xl">Forgot Password? </h3>

        <Form.Item label="Email" name="email">
          <Input type="email" required placeholder="Enter your email"/>
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

export default ForgetPassword;
