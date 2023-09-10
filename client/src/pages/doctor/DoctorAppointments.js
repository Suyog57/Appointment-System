import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout";
import axios from "axios";
import { message, Table } from "antd";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      // dispatch(showLoading());
      const res = await axios.get(
        `${process.env.REACT_APP_URL}/api/v1/doctor/doctor-appointments`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // dispatch(hideLoading());
      if (res.data.success) {
        console.log(res.data.data);
        const data = [...res.data.data].reverse();

        setAppointments(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const handleStatus = async (record, status) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_URL}/api/v1/doctor/update-status`,
        { appointmentsId: record._id, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        getAppointments();
      }
    } catch (error) {
      console.log(error);
      message.error("Something Went Wrong");
    }
  };

  const columns = [
    {
      title: <div className="text-sm md:text-base">ID</div>,
      dataIndex: "_id",
    },
    {
      title: <div className="text-sm md:text-base">Patient</div>,
      dataIndex: "userInfo",
    },
    {
      title: <div className="text-sm md:text-base">Date & Time</div>,
      dataIndex: "date",
      render: (text, record) => (
        <span>
          {record.date} &nbsp;
          {record.time}
        </span>
      ),
    },
    {
      title: <div className="text-sm md:text-base">Status</div>,
      dataIndex: "status",
    },
    {
      title: <div className="text-sm md:text-base">Actions</div>,
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" ? (
            <div className="d-flex">
              <button
                className="btn btn-success"
                onClick={() => handleStatus(record, "approved")}
              >
                Approve
              </button>
              <button
                className="btn btn-danger ms-2"
                onClick={() => handleStatus(record, "rejected")}
              >
                Reject
              </button>
            </div>
          ) : (
            <div className="">Reviewed</div>
          )}
        </div>
      ),
    },
  ];
  return (
    <Layout>
      <h1 className="text-center text-xl md:text-3xl p-4">Appointment List</h1>
      <Table
        className="overflow-x-auto"
        pagination={{ pageSize: 7 }}
        columns={columns}
        dataSource={appointments}
      />
    </Layout>
  );
};

export default DoctorAppointments;
