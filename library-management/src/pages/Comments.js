import React, { useEffect, useState, useMemo } from "react";
import { authApis, endpoints } from "../configs/API";
import { toast } from "react-hot-toast";
import { FiPlus, FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import moment from "moment";
import LoadingSpinner from "../components/layouts/LoadingSpinner";
import CommentFormModal from "../components/CommentFormModal";
import Pagination from "../components/layouts/Pagination";
const Comments = () => {
  const [comments, setComments] = useState([]);
  const [editingComment, setEditingComment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [size] = useState(8);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await authApis().get(
        `${endpoints.comments}?page=${page}&size=${size}`
      );
      setComments(res.data.content || []);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Lỗi tải comments:", err);
      toast.error("Không thể tải danh sách bình luận.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSubmit = async (formData) => {
    const isEditing = !!formData.id;
    const payload = {
      id: formData.id,
      userId: Number(formData.userId),
      bookId: Number(formData.bookId),
      commentText: formData.commentText,
      commentDate: formData.commentDate
        ? moment(formData.commentDate).format("YYYY-MM-DDTHH:mm:ss")
        : moment().format("YYYY-MM-DDTHH:mm:ss"),
    };

    console.log(payload);
    const action = isEditing
      ? authApis().patch(endpoints["comment-update"], payload)
      : authApis().post(endpoints["comment-add"], payload);

    const promise = action.then(() => {
      setShowModal(false);
      fetchComments();
    });

    toast.promise(promise, {
      loading: isEditing ? "Đang cập nhật..." : "Đang thêm mới...",
      success: isEditing
        ? "Cập nhật thành công!"
        : "Thêm bình luận thành công!",
      error: "Có lỗi xảy ra!",
    });
  };

  const handleEdit = (comment) => {
    setEditingComment(comment);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa bình luận này?")) {
      const promise = authApis()
        .delete(endpoints["comment-delete"](id))
        .then(() => fetchComments());
      toast.promise(promise, {
        loading: "Đang xóa...",
        success: "Xóa thành công!",
        error: "Xóa thất bại.",
      });
    }
  };

  const filteredComments = useMemo(() => {
    if (!searchTerm) return comments;
    return comments.filter(
      (c) =>
        c.user?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.user?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.book?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.commentText.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [comments, searchTerm]);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Quản lý Bình luận
        </h2>
        <button
          onClick={() => {
            setEditingComment(null);
            setShowModal(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FiPlus /> Thêm Bình luận
        </button>
      </div>

      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="relative">
          <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo tên người dùng, tên sách, hoặc nội dung..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      <CommentFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        editingComment={editingComment}
      />

      <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left text-gray-600 uppercase">
            <tr>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Người dùng</th>
              <th className="py-3 px-4">Sách</th>
              <th className="py-3 px-4">Nội dung</th>
              <th className="py-3 px-4">Ngày bình luận</th>
              <th className="py-3 px-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-10">
                  <LoadingSpinner />
                </td>
              </tr>
            ) : filteredComments.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-500">
                  Không có dữ liệu.
                </td>
              </tr>
            ) : (
              filteredComments.map((comment) => (
                <tr key={comment.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{comment.id}</td>
                  <td className="py-3 px-4">
                    {comment.user
                      ? `${comment.user.firstName} ${comment.user.lastName} `
                      : "N/A"}
                  </td>
                  <td className="py-3 px-4">{comment.book?.title || "N/A"}</td>
                  <td className="py-3 px-4 truncate max-w-sm">
                    {comment.commentText}
                  </td>
                  <td className="py-3 px-4">
                    {comment.commentDate
                      ? moment(comment.commentDate).format("DD/MM/YYYY HH:mm")
                      : "N/A"}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center items-center gap-3">
                      <button
                        onClick={() => handleEdit(comment)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Sửa"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Xóa"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
};

export default Comments;
