import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DatePicker, message, TimePicker } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";

const BookingPage = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const [doctors, setDoctors] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const dispatch = useDispatch();

  const getUserData = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_URL}/api/v1/doctor/getDoctorById`,
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        // console.log(user);
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAvailability = async (e) => {
    e.preventDefault();
    try {
      if (!date || !time) {
        message.warning("Date & Time Required!");
        return;
      }
      const newTime = `${String(time.$d.getHours()).padStart(2, '0')}:${String(time.$d.getMinutes()).padStart(2, '0')}`;

      const newDate=`${String(date.$d.getDate()).padStart(2, '0')}-${String(date.$d.getMonth()+1).padStart(2, '0')}-${String(date.$d.getFullYear())}`;

      const res = await axios.post(
        `${process.env.REACT_APP_URL}/api/v1/user/booking-availbility`,
        { doctorId: params.doctorId, date:newDate, time:newTime},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // dispatch(hideLoading());
      if (res.data.success) {
        setIsAvailable(true);
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  const handleBooking = async () => {
    try {
      if (!date || !time) {
        return alert("Date & Time Required");
      }
      // dispatch(showLoading());
      const newTime = `${String(time.$d.getHours()).padStart(2, '0')}:${String(time.$d.getMinutes()).padStart(2, '0')}`;
      const newDate=`${String(date.$d.getDate()).padStart(2, '0')}-${String(date.$d.getMonth()+1).padStart(2, '0')}-${String(date.$d.getFullYear())}`;

      const res = await axios.post(
        `${process.env.REACT_APP_URL}/api/v1/user/book-appointment`,
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: `${doctors.firstName} ${doctors.lastName}`,
          userInfo: `${user.name}`,
          date: newDate,
          time: newTime,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
      }else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
    //eslint-disable-next-line
  }, []);
  return (
    <Layout>
      <h3 className="text-center text-2xl md:text-3xl p-4">Booking Page</h3>
      <div className="container m-2 pb-4">
        {doctors && (
          <div>
            <h3 className="text-xl md:text-2xl">
              Dr. {doctors.firstName} {doctors.lastName}
            </h3>
            <h3 className="text-xl md:text-2xl">Fees : {doctors.feesPerCunsaltation}</h3>
            <h3 className="text-xl md:text-2xl">
              Timings : {doctors.timings && doctors.timings[0]} -{" "}
              {doctors.timings && doctors.timings[1]}{" "}
            </h3>

            <div className="d-flex flex-column w-50">
              <DatePicker
                className="m-2"
                format="DD-MM-YYYY"
                onChange={(value) => {
                  // console.log(value);

                  // setIsAvailable(true);
                  setDate(value);
                }}
              />
              <TimePicker
                format="HH:mm"
                className="m-2"
                onChange={(value) => {
                  // setIsAvailable(true);
                  // console.log(value);
                  setTime(value);
                  // setTime(moment(value).format("HH:mm"));
                }}
              />
              <button
                className="btn btn-primary mt-2 text-xs md:text-xl"
                onClick={handleAvailability}
              >
                Check Availability
              </button>
              {isAvailable && (
                <button className="btn btn-dark mt-2 text-xs md:text-xl" onClick={handleBooking}>
                  Book Now
                </button>
              )}
              {!isAvailable && (
                <button className="btn btn-dark mt-2 disabled text-xs md:text-xl" onClick={handleBooking}>
                  Book Now
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingPage;
