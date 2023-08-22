import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./../components/Layout";
import moment from "moment";
import { Table } from "antd";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_URL}/api/v1/user/user-appointments`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        console.log(res.data.data+'f');
        setAppointments(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const columns = [
    {
      title: <div className="text-sm md:text-base">ID</div>,
      dataIndex: "_id",
    },
    {
      title: <div className="text-sm md:text-base">Doctor</div>,
      dataIndex: "doctorInfo",
    },
    {
      title: <div className="text-sm md:text-base">Date & Time</div>,
      dataIndex: "date",
      render: (text, record) => (
        <span>
          {(record.date)} &nbsp;
          {record.time}
        </span>
      ),
    },
    {
      title: <div className="text-sm md:text-base">Status</div>,
      dataIndex: "status",
    },
  ];
  return (
    <Layout>
      <h1 className="text-center p-4 text-xl md:text-3xl">
        Your Appointments Lists
      </h1>
      <Table pagination={{pageSize:7}} className="overflow-x-auto" columns={columns} dataSource={appointments} />
    </Layout>
  );
};

export default Appointments;
