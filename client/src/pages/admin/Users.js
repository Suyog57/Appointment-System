import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout";
import axios from "axios";
import { Table } from "antd";

const Users = () => {
  const [users, setUsers] = useState([]);

  //getUsers
  const getUsers = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_URL}/api/v1/admin/getAllUsers`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const columns = [
    {
      title: <div className="text-sm md:text-base">Name</div>,
      dataIndex: "name",
    },
    {
      title: <div className="text-sm md:text-base">Email</div>,
      dataIndex: "email",
    },
    {
      title: <div className="text-sm md:text-base">IsDoctor</div>,
      dataIndex: "isDoctor",
      render: (text, record) => <span>{record.isDoctor ? "Yes" : "No"}</span>,
    },
    {
      title: <div className="text-sm md:text-base">Actions</div>,
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          <button className="btn btn-danger">Block</button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h1 className="text-center m-2 text-xl md:text-3xl p-4">Users List</h1>
      <Table className="overflow-x-auto" columns={columns} dataSource={users} pagination={{pageSize:7}} />
    </Layout>
  );
};

export default Users;
