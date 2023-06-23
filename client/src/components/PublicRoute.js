import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute({ children }) {
  if (localStorage.getItem("token")) {
    return <Navigate to={"/"} />;
  } else {
    return <Outlet/>;
  }
}