import React, { useState, useEffect } from "react";
import moment from "moment";
import { authApis, endpoints } from "../configs/API";
import toast from "react-hot-toast";

export default function RatingFormModal({ show, onClose, onSuccess, rating }) {
  const [formData, setFormData] = useState({
    userId: "",
    bookId: "",
    ratingValue: 0,
    ratingDate: moment().format("YYYY-MM-DD"),
  });

  useEffect(() => {
    if (rating) {
      setFormData({
        userId: rating.userId || rating.user?.id,
        bookId: rating.bookId || rating.book?.id,
        ratingValue: rating.ratingValue,
        ratingDate: rating.ratingDate,
      });
    }
  }, [rating]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      userId: Number(formData.userId),
      bookId: Number(formData.bookId),
      ratingValue: Number(formData.ratingValue),
    };

    try {
      if (rating) {
        await authApis().patch(endpoints["rating-update"], {
          id: rating.id,
          ...payload,
        });
        toast.success("Cập nhật đánh giá thành công!");
      } else {
        await authApis().post(endpoints["rating-add"], payload);
        toast.success("Thêm đánh giá thành công!");
      }
      onSuccess();
    } catch (err) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      console.error(err);
    }
  };

  if (!show) return null;

  return (
    <div className="modal bg-gray-900 bg-opacity-60 show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <form onSubmit={handleSubmit}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {rating ? "Sửa Đánh giá" : "Thêm Đánh giá"}
              </h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label>User ID</label>
                <input
                  type="number"
                  name="userId"
                  value={formData.userId||""}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label>Book ID</label>
                <input
                  type="number"
                  name="bookId"
                  value={formData.bookId}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label>Rating Value</label>
                <input
                  type="number"
                  name="ratingValue"
                  min="1"
                  max="5"
                  value={formData.ratingValue}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label>Ngày đánh giá</label>
                <input
                  type="date"
                  name="ratingDate"
                  value={formData.ratingDate || ""}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Hủy
              </button>
              <button type="submit" className="btn btn-primary">
                {rating ? "Cập nhật" : "Thêm"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
