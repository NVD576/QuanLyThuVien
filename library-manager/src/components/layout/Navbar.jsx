import React from 'react';

const Navbar = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b-4 border-indigo-600">
      <div className="flex items-center">
        <h2 className="text-xl font-semibold text-gray-800">Hệ thống Quản lý Thư viện</h2>
      </div>
       <div className="flex items-center">
        <span className="text-gray-600">Chào, Admin!</span>
       </div>
    </header>
  );
};

export default Navbar;
