import React, { useEffect, useState } from "react";
import useBorrows from "../hooks/useBorrows";

const BorrowList = () => {
  const { borrows, deleteBorrow } = useBorrows();



  const handleDelete = async (id) => {
    // if (window.confirm("Bạn có chắc chắn muốn xoá phiếu mượn này không?")) {
    //   try {
    //     await deleteBorrow(id);
    //     setBorrows((prev) => prev.filter((b) => b.id !== id));
    //   } catch (err) {
    //     console.error("Xoá thất bại:", err);
    //   }
    // }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Danh sách phiếu mượn</h2>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Người mượn</th>
            <th className="border px-2 py-1">Sách</th>
            <th className="border px-2 py-1">Ngày mượn</th>
            <th className="border px-2 py-1">Hạn trả</th>
            <th className="border px-2 py-1">Ngày trả</th>
            <th className="border px-2 py-1">Trạng thái</th>
            <th className="border px-2 py-1">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {borrows.length > 0 ? (
            borrows.map((b) => (
              <tr key={b.id} className="text-center">
                <td className="border px-2 py-1">{b.id}</td>
                <td className="border px-2 py-1">
                  {b.userFullName || "Không xác định"}
                </td>
                <td className="border px-2 py-1">{b.bookTitle}</td>
                <td className="border px-2 py-1">{b.borrowDate}</td>
                <td className="border px-2 py-1">{b.dueDate}</td>
                <td className="border px-2 py-1">{b.returnDate || "Chưa trả"}</td>
                <td className="border px-2 py-1">{b.status}</td>
                <td className="border px-2 py-1 space-x-2">
                  {/* Bổ sung nút cập nhật nếu cần */}
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-4">
                Không có dữ liệu mượn sách.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BorrowList;
