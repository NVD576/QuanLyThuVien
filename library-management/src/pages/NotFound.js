import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="text-center mt-5">
      <h1>404 - Trang không tồn tại</h1>
      <p>Xin lỗi, trang bạn đang tìm kiếm không có sẵn.</p>
      <Link to="/" className="btn btn-primary">Về trang chủ</Link>
    </div>
  );
};

export default NotFound;
