import React, { useEffect, useState } from "react";
import Layout from "./../components/Layout";
import { message, Tabs } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setUser } from "../redux/features/userSlice";

const NotificationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const [seen, setSeen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [seenNotifs, setSeenNotifs] = useState([]);
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
        setNotifs(res.data.data.notifications);
        setSeenNotifs(res.data.data.seennotifs);
      } else {
      }
    } catch (error) {
      console.log(error);
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
        const newSeenNotifications = [...user.seennotification];
        newSeenNotifications.push(...user.notifcation);
        const updatedUser = {
          ...user,
          notifcation: [],
          seennotification: newSeenNotifications,
        };

        dispatch(setUser(updatedUser));
        message.success(res.data.message);
        setSeen(true);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
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
        const updatedUser = {
          ...user,
          notifcation: [],
          seennotification: [],
        };

        dispatch(setUser(updatedUser));
        message.success(res.data.message);
        setSeen(false);
      } else {
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      // message.error("Something Went Wrong In Notifications");
    }
  };

  return (
    <Layout>
      <h4 className="p-4 text-center text-3xl">Notification Page</h4>
      <Tabs className="p-2">
        <Tabs.TabPane tab="UnRead" key={0}>
          <div className="d-flex justify-content-end">
            {user ? (
              user.notifcation.length > 0 ? (
                <h4
                  className="p-2 text-md md:text-xl"
                  onClick={handleMarkAllRead}
                  style={{ cursor: "pointer" }}
                >
                  Mark All Read
                </h4>
              ) : (
                <h4 className="p-2 text-md md:text-xl" style={{ cursor: "no-drop" }}>
                  Mark All Read
                </h4>
              )
            ) : (
              ""
            )}
          </div>
          {user ? (
            user.notifcation.length > 0 ? (
              user.notifcation.map((notificationMgs) => (
                <div className="card m-2" style={{ cursor: "pointer" }}>
                  <div
                    className="card-text p-1"
                    onClick={() => {
                      user.isAdmin
                        ? navigate("/admin/doctors")
                        : user.isDoctor
                        ? navigate("/doctor-appointments")
                        : navigate("/appointments");
                    }}
                  >
                    {notificationMgs.message}
                  </div>
                </div>
              ))
            ) : (
              <h3 className="text-center text-2xl">No notifications!</h3>
            )
          ) : (
            ""
          )}
          
        </Tabs.TabPane>
        <Tabs.TabPane tab="Read" key={1}>
          <div className="d-flex justify-content-end">
            {user ? (
              user.seennotification.length > 0 ? (
                <h4
                  className="p-2 text-primary text-md md:text-xl"
                  onClick={handleDeleteAllRead}
                  style={{ cursor: "pointer" }}
                >
                  Delete All Read
                </h4>
              ) : (
                <h4
                  className="p-2 text-primary text-md md:text-xl"
                  style={{ cursor: "no-drop" }}
                >
                  Delete All Read
                </h4>
              )
            ) : (
              ""
            )}
          </div>
          {user ? (
            user.seennotification.length > 0 ? (
              user.seennotification.map((notificationMgs) => (
                <div className="card m-2" style={{ cursor: "pointer" }}>
                  <div
                    className="card-text p-1"
                    onClick={() => navigate("/doctor-appointments")}
                  >
                    {notificationMgs.message}
                  </div>
                </div>
              ))
            ) : (
              <h3 className="text-center text-2xl">No notifications!</h3>
            )
          ) : (
            ""
          )}
          
        </Tabs.TabPane>
      </Tabs>
    </Layout>
  );
};

export default NotificationPage;
