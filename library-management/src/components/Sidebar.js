import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiBook, FiGrid, FiUsers, FiRepeat, FiBarChart2, FiUser, FiLogOut, FiChevronDown, FiChevronUp } from "react-icons/fi";
import cookie from "js-cookie";
import { MyDispatcherContext, MyUserContext } from "../configs/MyContexts";

const Sidebar = () => {
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatcherContext);
  const [openUserMenu, setOpenUserMenu] = useState(false);

  const handleLogout = () => {
    cookie.remove("token");
    dispatch({ type: "logout" });
  };

  const navLinks = [
    { path: "/", text: "Trang chủ", icon: <FiHome /> },
    { path: "/books", text: "Quản lý Sách", icon: <FiBook /> },
    { path: "/categories", text: "Quản lý Danh mục", icon: <FiGrid /> },
    { 
      text: "Quản lý user", 
      icon: <FiUsers />, 
      submenu: [
        { path: "/users/admins", text: "Quản lý Admin" },
        { path: "/users/librarians", text: "Quản lý Librarian" },
        { path: "/users/readers", text: "Quản lý Reader" },
      ]
    },
    { path: "/borrows", text: "Quản lý Mượn-Trả", icon: <FiRepeat /> },
    { path: "/stats", text: "Thống kê", icon: <FiBarChart2 /> },
    { path: "/profile", text: "Trang cá nhân", icon: <FiUser /> },
  ];

  return (
    <div className="sidebar d-flex flex-column flex-shrink-0 p-3 bg-light">
      <div className="sidebar-header d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
        <span className="mr-2 fs-5 fw-semibold">{`${user.firstName} ${user.lastName}`}</span>
      </div>
      <hr />
      <ul className="nav nav-pills flex-column">
        {navLinks.map((link) => (
          <li className="nav-item" key={link.text}>
            {link.submenu ? (
              <>
                <button
                  onClick={() => setOpenUserMenu(!openUserMenu)}
                  className="nav-link link-dark d-flex align-items-center w-100 text-start bg-transparent border-0"
                >
                  <span className="me-3 fs-5">{link.icon}</span>
                  {link.text}
                  <span className="ms-auto">{openUserMenu ? <FiChevronUp /> : <FiChevronDown />}</span>
                </button>
                {openUserMenu && (
                  <ul className="nav flex-column ms-4">
                    {link.submenu.map((sub) => (
                      <li className="nav-item" key={sub.path}>
                        <NavLink to={sub.path} className="nav-link link-dark">
                          {sub.text}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <NavLink to={link.path} className="nav-link link-dark d-flex align-items-center" end>
                <span className="me-3 fs-5">{link.icon}</span>
                {link.text}
              </NavLink>
            )}
          </li>
        ))}
      </ul>
      <hr />
      <div className="logout-section">
        <button onClick={handleLogout} className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center">
          <FiLogOut /> Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
