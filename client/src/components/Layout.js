import React, { useState } from "react";
import "../styles/LayoutStyles.css";
import { adminMenu, userMenu } from "./../Data/data";
import { useSelector } from "react-redux";
import { Badge, message } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const doctorMenu = [
    {
      name: "Home",
      path: `/`,
      icon: "fa-solid fa-house",
    },
    {
      name: "Appointments",
      path: `/doctor-appointments`,
      icon: "fa-solid fa-list",
    },

    {
      name: "Profile",
      path: `/doctor/profile/${user ? user._id : ""}`,
      icon: "fa-solid fa-user",
    },
  ];

  const SidebarMenu = user
    ? user.isAdmin
      ? adminMenu
      : user.isDoctor
      ? doctorMenu
      : userMenu
    : [];

  const handleLogout = () => {
    localStorage.clear();
    message.success("Logout Successfully");
    navigate(`/login`);
  };
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* <div className="main">
        <div className="layout">
          <div className="sidebar hidden md:block">
            <div className="logo">
              <h6>DOC APP</h6>
              <hr />
            </div>
            <div className="menu">
              {SidebarMenu.map((menu) => {
                const isActive = location.pathname === menu.path;
                return (
                  <>
                    <div className={`menu-item ${isActive && "active"}`}>
                      <i className={menu.icon}></i>
                      <Link to={menu.path}>{menu.name}</Link>
                    </div>
                  </>
                );
              })}
              <div className={`menu-item `} onClick={handleLogout}>
                <i className="fa-solid fa-right-from-bracket"></i>
                <Link to={"/login"}>Logout</Link>
              </div>
            </div>
          </div>

          <div className="content">
            <div className="header flex items-center justify-end">

              <i className="fa-solid fa-list text-xl" />

              <div className="header-content" style={{ cursor: "pointer" }}>
                <Badge
                  count={user && user.notifcation.length}
                  onClick={() => {
                    navigate(`/notification`);
                  }}
                >
                  <i class="fa-solid fa-bell"></i>
                </Badge>
                <Link to={"/profile"}>{user ? user.name : ""}</Link>
              </div>
            </div>
            <div className="body">{children}</div>
          </div>
        </div>
      </div> */}
      <div className="main">
        <div className="layout">
          <div
            style={{
              backgroundColor: user
                ? user.isAdmin
                  ? "teal"
                  : user.isDoctor
                  ? "indigo"
                  : ""
                : "",
            }}
            className="sidebar hidden md:block"
          >
            <div className="logo">
              <h6 className="text-light">DOC APP</h6>
              <hr />
            </div>
            <div className="flex justify-center align-middle mt-4">
              {user ? (
                user.isAdmin ? (
                  <h1 className="text-xl">Admin Panel</h1>
                ) : user.isDoctor ? (
                  <h1 className="text-xl">Doctor Panel</h1>
                ) : (
                  ""
                )
              ) : (
                ""
              )}
            </div>
            <div className="menu">
              {SidebarMenu.map((menu) => {
                const isActive = location.pathname === menu.path;
                return (
                  <>
                    <div className={`menu-item ${isActive && "active"}`}>
                      <i
                        style={{
                          color: isActive
                            ? user
                              ? user.isAdmin
                                ? "teal"
                                : user.isDoctor
                                ? "indigo"
                                : ""
                              : "white"
                            : "white",
                        }}
                        className={menu.icon}
                      ></i>
                      <Link
                        style={{
                          color: isActive
                            ? user
                              ? user.isAdmin
                                ? "teal"
                                : user.isDoctor
                                ? "indigo"
                                : ""
                              : "white"
                            : "white",
                        }}
                        to={menu.path}
                      >
                        {menu.name}
                      </Link>
                    </div>
                  </>
                );
              })}
              <div className={`menu-item `} onClick={handleLogout}>
                <i className="fa-solid fa-right-from-bracket"></i>
                <Link to="/login">Logout</Link>
              </div>
            </div>
          </div>

          <div className="content">
            {/* mobile nav */}
            {isOpen && (
              <div
                style={{
                  backgroundColor: user
                    ? user.isAdmin
                      ? "teal"
                      : user.isDoctor
                      ? "indigo"
                      : ""
                    : "",
                }}
                className="mb-4 width-[300px] bg-blue-700 text-white rounded-md shadow-md md:hidden"
              >
                <div className="logo">
                  <h6 className="text-light pt-2">DOC APP</h6>
                  <hr />
                </div>
                <div className="flex justify-center align-middle mt-4">
                  {user ? (
                    user.isAdmin ? (
                      <h1 className="text-xl">Admin Panel</h1>
                    ) : user.isDoctor ? (
                      <h1 className="text-xl">Doctor Panel</h1>
                    ) : (
                      ""
                    )
                  ) : (
                    ""
                  )}
                </div>
                <div className="menu">
                  {SidebarMenu.map((menu) => {
                    const isActive = location.pathname === menu.path;
                    return (
                      <>
                        <div className={`menu-item ${isActive && "active"}`}>
                          <i
                            style={{
                              color: isActive
                                ? user
                                  ? user.isAdmin
                                    ? "teal"
                                    : user.isDoctor
                                    ? "indigo"
                                    : ""
                                  : "white"
                                : "white",
                            }}
                            className={`${menu.icon} active:text-blue-700`}
                          ></i>
                          <Link
                            style={{
                              color: isActive
                                ? user
                                  ? user.isAdmin
                                    ? "teal"
                                    : user.isDoctor
                                    ? "indigo"
                                    : ""
                                  : "white"
                                : "white",
                            }}
                            to={menu.path}
                            className="active:text-blue-700"
                          >
                            {menu.name}
                          </Link>
                        </div>
                      </>
                    );
                  })}
                  <div className="menu-item pb-2" onClick={handleLogout}>
                    <i className="fa-solid fa-right-from-bracket"></i>
                    <Link to="/login">Logout</Link>
                  </div>
                </div>
              </div>
            )}

            <div className="header flex items-center">
              {!isOpen && (
                <i
                  onClick={() => setIsOpen(!isOpen)}
                  className="ml-2 mr-4 fa-solid fa-list text-xl md:hidden"
                />
              )}
              {isOpen && (
                <i
                  onClick={() => setIsOpen(!isOpen)}
                  className="ml-2 mr-4 fa-solid fa-close text-xl md:hidden"
                />
              )}

              <div className="header-content" style={{ cursor: "pointer" }}>
                <Badge
                  count={user && user.notifcation.length}
                  onClick={() => {
                    navigate("/notification");
                  }}
                >
                  <i class="fa-solid fa-bell"></i>
                </Badge>

                <Link to="/profile">{user ? user.name : ""}</Link>
              </div>
            </div>
            <div className="body md:h-[85vh]">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
