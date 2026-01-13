import React, { useEffect, useState } from "react";
import usePrintBooks from "../hooks/usePrintBooks";
import Pagination from "../components/layouts/Pagination";
import { authApis, endpoints } from "../configs/API";
import { FaEdit, FaTrash, FaBook, FaFilter, FaPlus, FaTimes } from "react-icons/fa";
import LoadingSpinner from "../components/layouts/LoadingSpinner";
import toast from "react-hot-toast";
const PrintBook = () => {
  const {
    printBooks,
    loading,
    totalPages,
    fetchPrintBooks,
    addPrintBook,
    updatePrintBook,
    deletePrintBook,
  } = usePrintBooks();

  const [page, setPage] = useState(0);
  const size = 5;

  const [books, setBooks] = useState([]);

  const [formData, setFormData] = useState({
    id: "",
    bookId: "",
    status: "Available",
  });

  const [filterBookId, setFilterBookId] = useState("");
  const [editing, setEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        let res = await authApis().get(endpoints["book-all"]);
        setBooks(res.data.content || res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadBooks();
  }, []);

  const loadPrintBooks = () => {
    fetchPrintBooks(page, size, filterBookId);
  };

  useEffect(() => {
    loadPrintBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filterBookId]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFilterBookIdChange = (e) => {
    setFilterBookId(e.target.value);
    setPage(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!editing) {
        await addPrintBook(formData);
      } else {
        await updatePrintBook(formData);
      }
      setFormData({ id: "", bookId: "", status: "Available" });
      setEditing(false);
      setShowForm(false);
      loadPrintBooks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (pb) => {
    setFormData({
      id: pb.id,
      bookId: pb.book?.id,
      status: pb.status,
    });
    setEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (pd) => {
    if (pd.status === "Borrowed") {
      toast.error("Sách đang được mượn nên không thể xoá")
      return;
    }
    if (window.confirm("Bạn có chắc muốn xóa bản in này?")) {
      try {
        await deletePrintBook(pd.id);
        toast.success("Xoá sách thành công!");
        loadPrintBooks();
      } catch (err) {
        toast.error("Xoá sách thất bại!");
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({ id: "", bookId: "", status: "Available" });
    setEditing(false);
    setShowForm(false);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4 sm:p-3 bg-gray-50 h-full">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700 flex items-center gap-2">
            <FaBook className="text-indigo-500" />
            Quản lý Sách In
          </h1>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="mt-3 sm:mt-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center gap-2 shadow-md"
          >
            <FaPlus /> Thêm Sách In
          </button>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="w-full sm:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FaFilter className="text-indigo-500" />
                Lọc theo sách
              </label>
              <select
                value={filterBookId}
                onChange={handleFilterBookIdChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Tất cả sách</option>
                {books.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-xl shadow-lg mb-2 border border-indigo-100">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-indigo-700">
                {editing ? "Cập nhật Sách In" : "Thêm Sách In Mới"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chọn sách
                </label>
                <select
                  name="bookId"
                  value={formData.bookId}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">-- Chọn sách --</option>
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="Available" className="text-green-600">Có sẵn</option>
                  <option value="Borrowed" className="text-yellow-600">Đã mượn</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all shadow-md"
                >
                  {editing ? "Cập nhật" : "Thêm mới"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition-all"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-x shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Tên sách
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Mã sách
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {printBooks.length > 0 ? (
                  printBooks.map((pb) => (
                    <tr key={pb.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {pb.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {pb.book?.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {pb.book?.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${pb.status === "Available"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                          }`}>
                          {pb.status === "Available" ? "Có sẵn" : "Đã mượn"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(pb)}
                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-lg hover:bg-indigo-100 transition-colors"
                            title="Sửa"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(pb)}
                            className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition-colors"
                            title="Xóa"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>


        {totalPages > 1 && (
          <div >
            <div className="bg-white p-2 rounded-xl shadow-md">
              <Pagination
                totalPages={totalPages}
                currentPage={page}
                onPageChange={setPage}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrintBook;
