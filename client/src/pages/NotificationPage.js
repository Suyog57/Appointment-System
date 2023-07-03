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
  const [seen, setSeen] = useState([1, 2, 2]);
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

      if (res.data.success) {
        const newArray = [1, 2, 3]; // Example new array
        setMyArray(newArray);
        console.log(myArray);
        // const arr1 = res.data.data.seennotifs,
        //   arr2 = res.data.data.notifications;
        // console.log(arr1);

        // setSeen([]);
        // setNotifs(arr2);
        // console.log(seen);
        message.success(res.data.message);
      } else {
        message.success(res.data.message);
      }
      // console.log(notifications);
      // console.log(seennotifs);
    } catch (error) {
      // dispatch(hideLoading());
      console.log(error);
      message.error("somthing went wrong");
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
      <h4 className="p-3 text-center">Notification Page</h4>
      <Tabs className="p-2">
        <Tabs.TabPane tab="unRead" key={0}>
          <div className="d-flex justify-content-end">
            <h4
              className="p-2"
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
                    onClick={() => navigate(notificationMgs.onClickPath)}
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
              className="p-2 text-primary"
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
                    onClick={() => navigate(notificationMgs.onClickPath)}
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
