import React, { useEffect, useState, useMemo } from "react";
import RatingFormModal from "../components/RatingFormModal";
import { authApis, endpoints } from "../configs/API";
import moment from "moment";
import toast from "react-hot-toast";
import Pagination from "../components/layouts/Pagination";
import LoadingSpinner from "../components/layouts/LoadingSpinner";

export default function Ratings() {
  const [ratings, setRatings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const [filterValue, setFilterValue] = useState("All");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [size] = useState(10);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const res = await authApis().get(
        `${endpoints.ratings}?page=${page}&size=${size}`
      );
      setRatings(res.data.content || []);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách bình luận.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa đánh giá này?")) return;
    try {
      await authApis().delete(endpoints["rating-delete"](id));
      toast.success("Xóa đánh giá thành công!");
      fetchRatings();
    } catch (err) {
      toast.error("Không thể xóa đánh giá.");
      console.error(err);
    }
  };

  const handleEdit = (rating) => {
    setSelectedRating(rating);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedRating(null);
    setShowModal(true);
  };

  const filteredRatings = useMemo(() => {
    if (filterValue === "All") return ratings;
    return ratings.filter((r) => r.ratingValue === Number(filterValue));
  }, [ratings, filterValue]);

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen font-sans">
      <h2 className="text-3xl font-extrabold mb-6 text-indigo-700">
        Quản lý Đánh giá
      </h2>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <button
          onClick={handleAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md shadow-md transition"
        >
          + Thêm Đánh giá
        </button>

        <select
          className="border border-indigo-400 rounded-md px-4 py-2 max-w-xs"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        >
          <option value="All">Tất cả giá trị</option>
          {[1, 2, 3, 4, 5].map((v) => (
            <option key={v} value={v}>
              {v} sao
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full text-gray-700 text-sm">
          <thead className="bg-indigo-100 text-indigo-700 uppercase font-semibold">
            <tr>
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Người dùng</th>
              <th className="py-3 px-6 text-left">Sách</th>
              <th className="py-3 px-6 text-left">Giá trị</th>
              <th className="py-3 px-6 text-left">Ngày đánh giá</th>
              <th className="py-3 px-6 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading&&<LoadingSpinner/>}
            {filteredRatings.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="py-10 text-center text-gray-400 italic"
                >
                  Không có đánh giá nào phù hợp.
                </td>
              </tr>
            ) : (
              filteredRatings.map((r) => (
                <tr
                  key={r.id}
                  className="border-b last:border-none hover:bg-indigo-50 transition-colors"
                >
                  <td className="py-4 px-6 font-semibold">{r.id}</td>
                  <td className="py-4 px-6">
                    {r.user?.firstName} {r.user?.lastName}
                  </td>
                  <td className="py-4 px-6">{r.book?.title || r.bookId}</td>
                  <td className="py-4 px-6 font-semibold text-yellow-600">
                    {"⭐".repeat(r.ratingValue)}{" "}
                    <span className="text-gray-500">({r.ratingValue})</span>
                  </td>
                  <td className="py-4 px-6">
                    {moment(r.ratingDate).format("DD/MM/YYYY")}
                  </td>
                  <td className="py-4 px-6 text-center space-x-3">
                    <button
                      onClick={() => handleEdit(r)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md transition"
                      title="Sửa"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
                      title="Xóa"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <RatingFormModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchRatings();
          }}
          rating={selectedRating}
        />
      )}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}
