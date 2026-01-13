import React, { useState, useEffect } from "react";
import LoadingSpinner from "../components/layouts/LoadingSpinner";
import { FaSearch, FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import useLibrarians from "../hooks/useLibrarians";
import Pagination from "../components/layouts/Pagination";
import {toast } from "react-hot-toast";

const initialForm = {
  id: null,
  avatar: null,
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  isActive: true,
  username: "",
  password: "",
  startDate: "",
};

const Librarians = () => {
  const {
    librarians,
    page,
    totalPages,
    keyword,
    setKeyword,
    setPage,
    loading,
    fetchLibrarians,
    addLibrarians,
    updateLibrarians,
    deleteLibrarians,
  } = useLibrarians();

  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState(keyword);
  const [selectedLibrarianId, setSelectedLibrarianId] = useState(null);

  useEffect(() => {
    setSearchTerm(keyword);
  }, [keyword]);

  const handleSearch = () => {
    setKeyword(searchTerm);
    setPage(0);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleEdit = (librarian) => {
    setForm({
      id: librarian.id,
      avatar: librarian.user.avatar,
      firstName: librarian.user.firstName,
      lastName: librarian.user.lastName,
      email: librarian.user.email,
      phone: librarian.user.phone,
      address: librarian.user.address,
      isActive: librarian.user.isActive,
      startDate: librarian.startDate
        ? new Date(librarian.startDate).toISOString().slice(0, 10)
        : "",
      username: librarian.user.username || "",
      password: "",
    });
    setIsEdit(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa không?")) {
      await deleteLibrarians(id);
      fetchLibrarians();
      setSelectedLibrarianId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    if (isEdit) formData.append("id", form.id);
    formData.append("firstName", form.firstName);
    formData.append("lastName", form.lastName);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("address", form.address);
    formData.append("isActive", form.isActive);
    formData.append("startDate", form.startDate);

    if (form.avatar instanceof File) {
      formData.append("file", form.avatar);
    }
    if (!isEdit) {
      formData.append("username", form.username);
      formData.append("password", form.password);
    } else {
  
      if (form.username) {
        formData.append("username", form.username);
      }
      if (form.password) {
        formData.append("password", form.password);
      }
    }

    try {
      if (form.id) {
        await updateLibrarians(formData);
      } else {
        await addLibrarians(formData);
      }
      setForm(initialForm);
      setShowForm(false);
      fetchLibrarians();
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error);
      toast.error( error.response.data);
    }
  };

  const handleCancel = () => {
    setForm(initialForm);
    setShowForm(false);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setKeyword("");
    setPage(0);
  };

  const handleRowClick = (librarianId) => {
    setSelectedLibrarianId(
      selectedLibrarianId === librarianId ? null : librarianId
    );
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        Quản lý Thủ thư
      </h2>

      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <FaTimes className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition w-full md:w-auto"
          >
            Tìm kiếm
          </button>
          <button
            onClick={() => {
              setForm(initialForm);
              setIsEdit(false);
              setShowForm(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 whitespace-nowrap w-full md:w-auto"
          >
            Thêm Thủ thư
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg relative">
            <button
              onClick={handleCancel}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-4 text-indigo-700">
              {isEdit ? "Cập nhật Thủ thư" : "Thêm Thủ thư mới"}
            </h3>
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <img
                src={
                  form.avatar instanceof File
                    ? URL.createObjectURL(form.avatar)
                    : form.avatar
                }
                alt="Avatar Preview"
                className="w-20 h-20 rounded-full object-cover"
              />
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleInputChange}
                placeholder="Họ"
                className="border px-4 py-2 rounded"
                required
              />
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleInputChange}
                placeholder="Tên"
                className="border px-4 py-2 rounded"
                required
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="border px-4 py-2 rounded"
                required
              />
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleInputChange}
                placeholder="Số điện thoại"
                className="border px-4 py-2 rounded"
              />
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleInputChange}
                placeholder="Địa chỉ"
                className="col-span-2 border px-4 py-2 rounded"
              />
              <div className="col-span-2">
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ngày bắt đầu làm việc
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleInputChange}
                  className="w-full border px-4 py-2 rounded"
                  required
                />
              </div>
              {/* Có thể thay đổi username và password khi sửa */}
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleInputChange}
                placeholder="Tên đăng nhập"
                className="border px-4 py-2 rounded"
                required
              />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleInputChange}
                placeholder={isEdit ? "Để trống nếu không thay đổi mật khẩu" : "Mật khẩu"}
                className="border px-4 py-2 rounded"
                required={!isEdit}
              />
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={(e) =>
                  setForm({ ...form, avatar: e.target.files[0] })
                }
                className="col-span-2 border px-4 py-2 rounded"
              />
              <label className="flex items-center gap-2 col-span-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleInputChange}
                />
                Hoạt động
              </label>
              <div className="col-span-2 flex justify-end gap-3">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                >
                  {isEdit ? "Cập nhật" : "Thêm"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
                >
                  Hủy
                </button>
              </div>
            </form>
            {loading && <LoadingSpinner />}
          </div>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left text-gray-600 uppercase">
            <tr>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Avatar</th>
              <th className="py-3 px-4">Họ tên</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Điện thoại</th>
              <th className="py-3 px-4">Ngày bắt đầu</th>
              <th className="py-3 px-4 text-center">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-10">
                  <LoadingSpinner />
                </td>
              </tr>
            ) : librarians.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500">
                  Không tìm thấy dữ liệu.
                </td>
              </tr>
            ) : (
              librarians.map((librarian) => (
                <React.Fragment key={librarian.id}>
                  <tr
                    className={`cursor-pointer hover:bg-indigo-50 transition-colors ${
                      selectedLibrarianId === librarian.id
                        ? "bg-indigo-100"
                        : ""
                    }`}
                    onClick={() => handleRowClick(librarian.id)}
                  >
                    <td className="py-3 px-4 font-medium">{librarian.id}</td>
                    <td className="py-3 px-4">
                      <img
                        src={librarian.user.avatar}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="py-3 px-4">{`${librarian.user.firstName} ${librarian.user.lastName}`}</td>
                    <td className="py-3 px-4">{librarian.user.email}</td>
                    <td className="py-3 px-4">{librarian.user.phone}</td>
                    <td className="py-3 px-4">
                      {new Date(librarian.startDate).toLocaleDateString(
                        "vi-VN"
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {librarian.user.isActive ? (
                        <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                          Hoạt động
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">
                          Tạm ngưng
                        </span>
                      )}
                    </td>
                  </tr>
                  {selectedLibrarianId === librarian.id && (
                    <tr className="bg-gray-100">
                      <td colSpan="7" className="py-3 px-4">
                        <div className="flex justify-end items-center gap-3">
                          <span className="text-sm font-medium text-gray-700">
                            Hành động:
                          </span>
                          <button
                            onClick={() => handleEdit(librarian)}
                            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            <FaEdit /> Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(librarian.id)}
                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            <FaTrash /> Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default Librarians;
