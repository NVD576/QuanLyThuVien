import React, { useState, useEffect } from "react";
import moment from "moment";

const CommentFormModal = ({ isOpen, onClose, onSubmit, editingComment }) => {
  const initialForm = {
    userId: "",
    bookId: "",
    commentText: "",
    commentDate: moment().format("YYYY-MM-DDTHH:mm"),
  };

  const [formData, setFormData] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editingComment) {
        setFormData({
          id: editingComment.id,
          userId: editingComment.user?.id || "",
          bookId: editingComment.book?.id || "",
          commentText: editingComment.commentText || "",
          commentDate: editingComment.commentDate
            ? moment(editingComment.commentDate).format("YYYY-MM-DDTHH:mm")
            : "",
        });
      } else {
        setFormData(initialForm);
      }
    }
  }, [editingComment, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log(formData);

    await onSubmit(formData);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">
            {editingComment ? "Cập nhật Bình luận" : "Thêm Bình luận mới"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="userId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                User ID
              </label>
              <input
                id="userId"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                type="number"
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="bookId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Book ID
              </label>
              <input
                id="bookId"
                name="bookId"
                value={formData.bookId}
                onChange={handleChange}
                type="number"
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="commentText"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nội dung bình luận
            </label>
            <textarea
              id="commentText"
              name="commentText"
              value={formData.commentText}
              onChange={handleChange}
              rows="4"
              required
              className="w-full px-3 py-2 border rounded-lg"
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="commentDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ngày bình luận
            </label>
            <input
              id="commentDate"
              name="commentDate"
              value={formData.commentDate}
              onChange={handleChange}
              type="datetime-local"
              className="w-full px-3 py-2 border rounded-lg"
            />
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
                : editingComment
                ? "Cập nhật"
                : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentFormModal;
