import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="text-center my-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-2 text-xl font-bold text-green-400">Đang tải dữ liệu...</p>
    </div>
  );
};

export default LoadingSpinner;
