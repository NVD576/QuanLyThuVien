import React, { useState, useMemo } from "react";
import LoadingSpinner from "../components/layouts/LoadingSpinner";
import { FaSearch, FaTimes } from "react-icons/fa";
import useAdmins from "../hooks/useAdmins";

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
};

const Admins = () => {
  const { admins ,loading, fetchAdmins, addAdmin, updateAdmin,deleteAdmin } = useAdmins();

  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, active, inactive

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleEdit = (user) => {
    setForm({
      id: user.id,
      avatar: user.user.avatar,
      firstName: user.user.firstName,
      lastName: user.user.lastName,
      email: user.user.email,
      phone: user.user.phone,
      address: user.user.address,
      isActive: user.user.isActive,
    });
    setIsEdit(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này không?")) {
      await deleteAdmin(id);
      fetchAdmins();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id", form.id || "");
    formData.append("firstName", form.firstName);
    formData.append("lastName", form.lastName);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("address", form.address);
    formData.append("isActive", form.isActive ? "true" : "false");
    if (form.avatar instanceof File) {
      formData.append("file", form.avatar);
    }
    if (!isEdit) {
      formData.append("username", form.username);
      formData.append("password", form.password);
    }

    try {
      if (form.id) {
        await updateAdmin(formData);
      } else {
        await addAdmin(formData);
      }
      setForm(initialForm);
      setShowForm(false);
      fetchAdmins();
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error);
    }
  };

  const handleCancel = () => {
    setForm(initialForm);
    setShowForm(false);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  // Lọc và tìm kiếm members
  const filteredMembers = useMemo(() => {
    return admins.filter((member) => {
      const user = member.user;
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const email = user.email.toLowerCase();
      const phone = user.phone || "";
      const address = user.address || "";
      
      // Tìm kiếm theo từ khóa
      const matchesSearch = searchTerm === "" || 
        fullName.includes(searchTerm.toLowerCase()) ||
        email.includes(searchTerm.toLowerCase()) ||
        phone.includes(searchTerm.toLowerCase()) ||
        address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.id.toString().includes(searchTerm);

      // Lọc theo trạng thái
      const matchesStatus = statusFilter === "all" ||
        (statusFilter === "active" && user.isActive) ||
        (statusFilter === "inactive" && !user.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [admins, searchTerm, statusFilter]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-indigo-700">
        Quản lý Người dùng
      </h2>

      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Thanh tìm kiếm */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, số điện thoại, địa chỉ hoặc ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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

          {/* Bộ lọc trạng thái */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Trạng thái:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Tất cả</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>

          {/* Button thêm user */}
          <button
            onClick={() => {
              setForm(initialForm);
              setIsEdit(false);
              setShowForm(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 whitespace-nowrap"
          >
            ➕ Thêm Người dùng
          </button>
        </div>

        {/* Thống kê */}
        <div className="mt-3 text-sm text-gray-600">
          Hiển thị {filteredMembers.length} / {admins.length} người dùng
          {searchTerm && ` cho "${searchTerm}"`}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-2xl p-6 rounded shadow-lg relative">
            <button
              onClick={handleCancel}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <h3 className="text-xl font-semibold mb-4 text-indigo-700">
              {isEdit ? "Cập nhật người dùng" : "Thêm người dùng"}
            </h3>

            <form
              onSubmit={handleSubmit}
              className="grid gap-4 sm:grid-cols-2"
            >
              <img
                src={
                  form.avatar instanceof File
                    ? URL.createObjectURL(form.avatar)
                    : form.avatar
                }
                alt="Avatar Preview"
                className="w-20 h-20 rounded-full"
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
                className="border px-4 py-2 rounded"
              />
              {!isEdit && (
                <>
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
                    placeholder="Mật khẩu"
                    className="border px-4 py-2 rounded"
                    required
                  />
                </>
              )}
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={(e) =>
                  setForm({ ...form, avatar: e.target.files[0] })
                }
                className="border px-4 py-2 rounded"
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
                  {form.id ? "Cập nhật" : "Thêm"}
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

      {/* Bảng hiển thị */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm || statusFilter !== "all" 
              ? "Không tìm thấy người dùng nào phù hợp với điều kiện tìm kiếm"
              : "Chưa có người dùng nào"
            }
          </div>
        ) : (
          <table className="w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border-b text-left">ID</th>
                <th className="py-3 px-4 border-b text-left">Avatar</th>
                <th className="py-3 px-4 border-b text-left">Họ tên</th>
                <th className="py-3 px-4 border-b text-left">Email</th>
                <th className="py-3 px-4 border-b text-left">Điện thoại</th>
                <th className="py-3 px-4 border-b text-left">Địa chỉ</th>
                <th className="py-3 px-4 border-b text-left">Ngày tạo</th>
                <th className="py-3 px-4 border-b text-left">Trạng thái</th>
                <th className="py-3 px-4 border-b text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{u.id}</td>
                  <td className="py-2 px-4 border-b">
                    <img
                      src={u.user.avatar || "default-avatar.png"}
                      alt="avatar"
                      className="w-10 h-10 rounded-full"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    {u.user.firstName} {u.user.lastName}
                  </td>
                  <td className="py-2 px-4 border-b">{u.user.email}</td>
                  <td className="py-2 px-4 border-b">{u.user.phone}</td>
                  <td className="py-2 px-4 border-b">{u.user.address}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(u.user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex justify-center">
                      {u.user.isActive ? (
                        <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(u)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Admins;