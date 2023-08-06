import React, { useEffect, useState } from "react";
import Layout from "./../components/Layout";
import { message, Tabs } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NotificationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const [notifs, setNotifs] = useState([]);
  const [seen, setSeen] = useState([]);
  const [myArray, setMyArray] = useState([]);
  const getAllNotifications = async () => {
    try {
      // dispatch(showLoading());
      const res = await axios.post(
        `${process.env.REACT_APP_URL}/api/v1/user/get-all-notification`,
        {
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(res.data);

      if (res.data.success) {
        
        setNotifs(res.data.notifcations);
        setSeen(res.data.seennotifs);
        
        // message.success(res.data.message);
      } else {
        // message.success(res.data.message);
      }
      // console.log(notifications);
      // console.log(seennotifs);
    } catch (error) {
      // dispatch(hideLoading());
      console.log(error);
      // message.error("somthing went wrong");
    }
  };

  useEffect(() => {
    getAllNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      dispatch(showLoading());

      const res = await axios.post(
        `${process.env.REACT_APP_URL}/api/v1/user/mark-all-notification`,
        {
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        window.location.reload();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("somthing went wrong");
    }
  };

  const handleDeleteAllRead = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        `${process.env.REACT_APP_URL}/api/v1/user/delete-all-notification`,
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        window.location.reload();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Somthing Went Wrong In Ntifications");
    }
  };

  return (
    <Layout>
      <h4 className="p-4 text-center text-3xl">Notification Page</h4>
      <Tabs className="p-2">
        <Tabs.TabPane tab="UnRead" key={0}>
          <div className="d-flex justify-content-end">
            <h4
              className="p-2 text-xl"
              onClick={handleMarkAllRead}
              style={{ cursor: "pointer" }}
            >
              Mark All Read
            </h4>
          </div>
          {user
            ? user.notifcation.map((notificationMgs) => (
                <div className="card m-2" style={{ cursor: "pointer" }}>
                  <div
                    className="card-text p-1"
                    onClick={() => navigate('/doctor-appointments')}
                  >
                    {notificationMgs.message}
                  </div>
                </div>
              ))
            : ""}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Read" key={1}>
          <div className="d-flex justify-content-end">
            <h4
              className="p-2 text-primary text-xl"
              onClick={handleDeleteAllRead}
              style={{ cursor: "pointer" }}
            >
              Delete All Read
            </h4>
          </div>
          {user
            ? user.seennotification.map((notificationMgs) => (
                <div className="card m-2" style={{ cursor: "pointer" }}>
                  <div
                    className="card-text p-1"
                    onClick={() => navigate('/doctor-appointments')}
                  >
                    {notificationMgs.message}
                  </div>
                </div>
              ))
            : ""}
        </Tabs.TabPane>
      </Tabs>
    </Layout>
  );
};

export default NotificationPage;
