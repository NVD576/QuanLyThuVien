import React, { useState, useEffect } from "react";
import moment from "moment";

const FineFormModal = ({ isOpen, onClose, onSubmit, editingFine }) => {
  const initialForm = {
    borrowId: "",
    amount: "",
    reason: "",
    issueDate: moment().format("YYYY-MM-DD"),
    paidDate: "",
    status: "Pending",
  };

  const [formData, setFormData] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editingFine) {
        setFormData({
          id: editingFine.id,
          borrowId: editingFine.borrow?.id || "",
          amount: editingFine.amount,
          reason: editingFine.reason || "",
          issueDate: moment(editingFine.issueDate).format("YYYY-MM-DD"),
          paidDate: editingFine.paidDate
            ? moment(editingFine.paidDate).format("YYYY-MM-DD")
            : "",
          status: editingFine.status || "Pending",
        });
      } else {
        setFormData(initialForm);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingFine, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await onSubmit(formData);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">
            {editingFine ? "Cập nhật Khoản phạt" : "Thêm Khoản phạt mới"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="borrowId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ID Phiếu mượn
            </label>
            <input
              id="borrowId"
              name="borrowId"
              value={formData.borrowId}
              onChange={handleChange}
              type="number"
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Số tiền phạt (VND)
            </label>
            <input
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              type="number"
              step="1000"
              min="0"
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Lý do
            </label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border rounded-lg"
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="issueDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ngày phát sinh
            </label>
            <input
              id="issueDate"
              name="issueDate"
              type="date"
              value={formData.issueDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label
              htmlFor="paidDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ngày thanh toán
            </label>
            <input
              id="paidDate"
              name="paidDate"
              value={formData.paidDate}
              onChange={handleChange}
              type="date"
              min={formData.issueDate}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Trạng thái
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="Pending">Đang chờ</option>
              <option value="Paid">Đã thanh toán</option>
              <option value="Waived">Đã miễn</option>
            </select>
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300"
            >
              {isLoading
                ? "Đang lưu..."
                : editingFine
                ? "Cập nhật"
                : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FineFormModal;
