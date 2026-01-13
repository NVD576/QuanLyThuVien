import React, { useState, useMemo } from "react";
import useAdmins from "../hooks/useAdmins";
import LoadingSpinner from "../components/layouts/LoadingSpinner";
import { FaSearch, FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import {  toast } from "react-hot-toast";

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
  const { admins, loading, fetchAdmins, addAdmin, updateAdmin, deleteAdmin } =
    useAdmins();

  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAdminId, setSelectedAdminId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleEdit = (admin) => {
    setForm({
      id: admin.id,
      avatar: admin.user.avatar,
      firstName: admin.user.firstName,
      lastName: admin.user.lastName,
      email: admin.user.email,
      phone: admin.user.phone,
      address: admin.user.address,
      isActive: admin.user.isActive,
      username: admin.user.username || "",
      password: "",
    });
    setIsEdit(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa quản trị viên này không?")) {
      await deleteAdmin(id);
      fetchAdmins();
      setSelectedAdminId(null);
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
    if (form.avatar instanceof File) {
      formData.append("file", form.avatar);
    }
    if (!isEdit) {
      formData.append("password", form.password);
      formData.append("username", form.username); // sửa lỗi thêm adimin
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
        await updateAdmin(formData);
      } else {
        await addAdmin(formData);
      }
      setForm(initialForm);
      setShowForm(false);
      fetchAdmins();
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
  };

  const filteredAdmins = useMemo(() => {
    return admins.filter((admin) => {
      const user = admin.user;
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const email = user.email.toLowerCase();
      const phone = user.phone || "";
      const address = user.address || "";

      const matchesSearch =
        searchTerm === "" ||
        fullName.includes(searchTerm.toLowerCase()) ||
        email.includes(searchTerm.toLowerCase()) ||
        phone.includes(searchTerm.toLowerCase()) ||
        address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.id.toString().includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.isActive) ||
        (statusFilter === "inactive" && !user.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [admins, searchTerm, statusFilter]);

  const handleRowClick = (adminId) => {
    setSelectedAdminId(selectedAdminId === adminId ? null : adminId);
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        Quản lý Admin
      </h2>

      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="relative md:col-span-2">
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

          <div className="grid grid-cols-2 gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
            <button
              onClick={() => {
                setForm(initialForm);
                setIsEdit(false);
                setShowForm(true);
              }}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 whitespace-nowrap"
            >
              Thêm Admin
            </button>
          </div>
        </div>
        <div className="mt-3 text-sm text-gray-600">
          Hiển thị {filteredAdmins.length} / {admins.length} kết quả
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
              {isEdit ? "Cập nhật Admin" : "Thêm Admin mới"}
            </h3>
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
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
                className="col-span-2 border px-4 py-2 rounded"
              />

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

      <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left text-gray-600 uppercase">
            <tr>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Avatar</th>
              <th className="py-3 px-4">Họ tên</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Điện thoại</th>
              <th className="py-3 px-4">Ngày tạo</th>
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
            ) : filteredAdmins.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500">
                  Không tìm thấy dữ liệu.
                </td>
              </tr>
            ) : (
              filteredAdmins.map((admin) => (
                <React.Fragment key={admin.id}>
                  <tr
                    className={`cursor-pointer hover:bg-indigo-50 transition-colors ${
                      selectedAdminId === admin.id ? "bg-indigo-100" : ""
                    }`}
                    onClick={() => handleRowClick(admin.id)}
                  >
                    <td className="py-3 px-4 font-medium">{admin.id}</td>
                    <td className="py-3 px-4">
                      <img
                        src={admin.user.avatar}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="py-3 px-4">{`${admin.user.firstName} ${admin.user.lastName}`}</td>
                    <td className="py-3 px-4">{admin.user.email}</td>
                    <td className="py-3 px-4">{admin.user.phone}</td>
                    <td className="py-3 px-4">
                      {new Date(admin.user.createdAt).toLocaleDateString(
                        "vi-VN"
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {admin.user.isActive ? (
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

                  {selectedAdminId === admin.id && (
                    <tr className="bg-gray-100">
                      <td colSpan="7" className="py-3 px-4">
                        <div className="flex justify-end items-center gap-3">
                          <span className="text-sm font-medium text-gray-700">
                            Hành động:
                          </span>
                          <button
                            onClick={() => handleEdit(admin)}
                            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            <FaEdit /> Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(admin.id)}
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
    </div>
  );
};

export default Admins;
