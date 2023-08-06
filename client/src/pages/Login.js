import React from "react";
import "../styles/RegisterStyles.css";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
// import { GoogleLogin } from "react-google-login";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onfinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        `${process.env.REACT_APP_URL}/api/v1/user/login`,
        values
      );
      window.location.reload();

      dispatch(hideLoading());

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        message.success("Login Successfully");
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

  const responseGoogleSuccess = async (response) => {
    console.log(response);
    // try {
    //   const res = await axios({
    //     method: "POST",
    //     url: `${process.env.server_url}/api/v1/user/googlelogin`,
    //     data: { idToken: response.tokenId },
    //   });
    //   console.log(res);
    //   if (res.data.success) {
    //     localStorage.setItem("token", res.data.token);
    //     message.success("Login Successfully");
    //     navigate(`/`);
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
  };
  const responseGoogleError = (response) => {
    console.log(response);
  };

  return (
    <div
      className="form-container min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/loginimage.jpg')",
      }}
    >
      <img src="/loginimage.jpg" />
      <Form
        layout="vertical"
        onFinish={onfinishHandler}
        className="register-form shadow-md rounded-lg w-9/12 md:w-6/12 lg:w-3/12"
      >
        <h3 className="text-center text-3xl">Login Form </h3>

        <Form.Item className="text-xl" label="Email" name="email">
          <Input type="email" required />
        </Form.Item>
        <Form.Item className="text-xl" label="Password" name="password">
          <Input type="password" required />
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
        <br className="md:hidden"/>
        <Link to={`/forget-password`} className="m-2 mt-4 underline">
          Forgot Password?
        </Link>
        {/* {process.env.REACT_APP_CLIENT_ID} */}
        {/* <GoogleLogin
          // clientId={process.env.REACT_APP_CLIENT_ID}
          clientId="120196348856-e0qvv3qqpn4hmhb8fvkj2u3m26k59p2k.apps.googleusercontent.com"
          buttonText="Login with google"
          onSuccess={responseGoogleSuccess}
          onFailure={responseGoogleError}
          cookiePolicy="single_host_origin"
        /> */}
      </Form>
    </div>
  );
};

export default Login;
