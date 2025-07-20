import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaBook, FaUsers, FaTachometerAlt } from 'react-icons/fa';

const Sidebar = () => {
  const navLinkClasses = ({ isActive }) =>
    `flex items-center px-4 py-2 mt-2 text-gray-100 rounded-md transition-colors duration-200 transform ${
      isActive ? 'bg-gray-700' : 'hover:bg-gray-700'
    }`;

  return (
    <div className="flex flex-col w-64 bg-gray-800 text-white">
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <FaBook className="text-indigo-400 w-8 h-8 mr-2" />
        <h1 className="text-2xl font-bold">Thư Viện</h1>
      </div>
      <nav className="flex-1 px-2 py-4">
        <NavLink to="/" className={navLinkClasses}>
          <FaTachometerAlt className="mr-3" /> Dashboard
        </NavLink>
        <NavLink to="/books" className={navLinkClasses}>
          <FaBook className="mr-3" /> Quản lý Sách
        </NavLink>
        <NavLink to="/members" className={navLinkClasses}>
          <FaUsers className="mr-3" /> Quản lý Thành viên
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
