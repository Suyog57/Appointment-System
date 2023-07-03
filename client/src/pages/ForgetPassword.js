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
        className="register-form"
      >
        <h3 className="text-center">Forget Password </h3>

        <Form.Item label="Email" name="email">
          <Input type="email" required />
        </Form.Item>

        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </Form>
    </div>
  );
};

export default ForgetPassword;
