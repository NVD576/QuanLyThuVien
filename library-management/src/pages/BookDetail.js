import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { authApis, endpoints } from "../configs/API";
import LoadingSpinner from "../components/layouts/LoadingSpinner";
import { FiUser, FiCalendar, FiPrinter, FiStar, FiPlus } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { FaTrash } from "react-icons/fa";

const BookDetail = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [printBooks, setPrintBooks] = useState([]);
  const [comments, setComments] = useState([]);
  const [rating, setRating] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const [bookRes, printBooksRes, commentsRes, ratingRes] =
        await Promise.all([
          authApis().get(endpoints["book-id"](bookId)),
          authApis().get(endpoints["printBook-bookid"](bookId)),
          authApis().get(endpoints["comment-bookId"](bookId)),
          authApis().get(endpoints["rating-book-average"](bookId)),
        ]);

      setBook(bookRes.data);
      setPrintBooks(printBooksRes.data);
      setComments(commentsRes.data);
      setRating(ratingRes.data);
    } catch (err) {
      console.error("Lỗi khi tải chi tiết sách:", err);
      setError("Không thể tải thông tin sách. Vui lòng thử lại.");
      toast.error("Không thể tải thông tin sách.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookId && bookId !== "undefined") {
      fetchBookDetails();
    } else {
      setError("ID sách không hợp lệ.");
      setLoading(false);
    }
  }, [bookId]);

  const handleAddPrintBook = async () => {
    try {
      setAdding(true);
      await authApis().post(endpoints["printBook-add"], {
        bookId: bookId,
        status: "Available",
      });
      toast.success("Thêm bản in thành công!");

      const res = await authApis().get(endpoints["printBook-bookid"](bookId));
      setPrintBooks(res.data);
      fetchBookDetails();
    } catch (err) {
      console.error(err);
      toast.error("Không thể thêm bản in.");
    } finally {
      setAdding(false);
    }
  };

  const handleDeletePrintBook = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá bản in này?")) return;

    try {
      await authApis().delete(endpoints["printBook-delete"](id));
      toast.success("Xoá bản in thành công!");
      setPrintBooks((prev) => prev.filter((pb) => pb.id !== id));
    } catch (err) {
      console.error("Lỗi xoá bản in:", err);
      toast.error("Không thể xoá bản in.");
    }
  };

  const StatusBadge = ({ status }) => {
    const isAvailable = status === "Available";
    return (
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full ${
          isAvailable
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800"
        }`}
      >
        {isAvailable ? "Có sẵn" : "Đang mượn"}
      </span>
    );
  };

  if (loading)
    return (
      <div className="h-full overflow-y-auto bg-gray-50">
        <div className="flex justify-center items-center min-h-full">
          <LoadingSpinner />
        </div>
      </div>
    );

  if (error)
    return (
      <div className="h-full overflow-y-auto bg-gray-50">
        <div className="text-center text-red-500 p-8 min-h-full flex items-center justify-center">
          {error}
        </div>
      </div>
    );

  if (!book)
    return (
      <div className="h-full overflow-y-auto bg-gray-50">
        <div className="text-center text-gray-500 p-8 min-h-full flex items-center justify-center">
          Không tìm thấy sách.
        </div>
      </div>
    );

  return (
    <div className="book-detail-container h-full overflow-y-auto bg-gray-50">
      <div className="min-h-full py-4 sm:py-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-1 flex justify-center">
              <img
                src={book.image}
                alt={book.title}
                className="w-full max-w-xs rounded-lg shadow-md object-cover"
              />
            </div>
            <div className="md:col-span-2">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {book.title}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                bởi{" "}
                <span className="font-semibold text-indigo-600">
                  {book.author}
                </span>
              </p>

              <div className="flex items-center mb-4">
                <span className="text-yellow-500 flex items-center">
                  <FiStar className="mr-1" /> {rating}
                </span>
                <span className="text-gray-400 mx-2">|</span>
                <span className="text-gray-600">
                  {Array.isArray(comments) ? comments.length : 0} bình luận
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
                <div className="flex items-center">
                  <FiUser className="mr-2 text-indigo-500 flex-shrink-0" />
                  <strong>Nhà xuất bản:</strong>
                  <span className="ml-2 truncate">{book.publisher}</span>
                </div>
                <div className="flex items-center">
                  <FiCalendar className="mr-2 text-indigo-500 flex-shrink-0" />
                  <strong>Năm XB:</strong>
                  <span className="ml-2">{book.publicationYear}</span>
                </div>
                <div className="flex items-center">
                  <FiPrinter className="mr-2 text-indigo-500 flex-shrink-0" />
                  <strong>Số lượng:</strong>
                  <span className="ml-2">{book.totalCopies}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Tình trạng kho
                </h3>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Số bản sao:</p>
                  <p
                    className={`text-2xl font-bold ${
                      book.availableCopies > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {book.availableCopies} / {book.totalCopies}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
              Mô tả
            </h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {book.description}
            </p>
          </div>

          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Các bản in
              </h2>
<span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
  Tổng số bản in: {printBooks?.length || 0}
</span>

              <button
                onClick={handleAddPrintBook}
                disabled={adding}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                <FiPlus className="mr-2" />
                {adding ? "Đang thêm..." : "Thêm bản in"}
              </button>
            </div>

            <div className="overflow-hidden bg-white rounded-lg border border-gray-200">
              <div className="overflow-x-auto">
                <div className="max-h-64 overflow-y-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead className="bg-gray-100 text-gray-600 uppercase sticky top-0 z-10">
                      <tr>
                        <th className="py-3 px-4 font-semibold">ID Bản in</th>
                        <th className="py-3 px-4 text-center font-semibold">
                          Trạng thái
                        </th>
                        <th className="py-3 px-4 text-center font-semibold">
                          Hành động
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {Array.isArray(printBooks) && printBooks.length > 0 ? (
                        printBooks.map((pb) => (
                          <tr
                            key={pb.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-3 px-4 font-medium text-gray-900">
                              {pb.id}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <StatusBadge status={pb.status} />
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => handleDeletePrintBook(pb.id)}
                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow hover:from-red-600 hover:to-red-700 hover:shadow-md transition-all duration-200"
                              >
                                <FaTrash className="mr-2" />
                                Xoá
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="3"
                            className="text-center py-8 text-gray-500"
                          >
                            Không có bản in nào.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
              Đánh giá & Bình luận
            </h2>
            <div className="space-y-4">
              {Array.isArray(comments) && comments.length > 0 ? (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={comment.user.avatar}
                      alt="avatar"
                      className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 mb-1">
                        {`${comment.user.firstName} ${comment.user.lastName}`}
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {comment.commentText}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Chưa có bình luận nào.
                </div>
              )}
            </div>
          </div>

          <div className="h-8"></div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
