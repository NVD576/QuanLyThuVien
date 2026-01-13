import React, { useState, useEffect, useContext } from "react";
import {  toast } from "react-hot-toast";
import {
  FiPlus,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import moment from "moment";

import useMembers from "../hooks/useMembers";
import LoadingSpinner from "../components/layouts/LoadingSpinner";
import Pagination from "../components/layouts/Pagination";
import { MyUserContext } from "../configs/MyContexts";

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
  membershipLevel: "Basic",
};

const Members = () => {
  const {
    members,
    loading,
    page,
    setPage,
    size,
    setSize,
    keyword,
    setKeyword,
    totalPages,
    fetchMembers,
    addMember,
    updateMember,
    deleteMember,
  } = useMembers();

  const [form, setForm] = useState(initialForm);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const currentUser = useContext(MyUserContext);
  const isAdmin = currentUser && currentUser.role === "Admin";

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers, page, size]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(searchTerm);
      setPage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, setKeyword, setPage]);

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
      membershipLevel: user.membershipLevel,
      username: user.user.username,
      password: "",
    });
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này không?")) {
      try {
        await deleteMember(id);
        fetchMembers();
        toast.success("Xóa thành viên thành công!");
      } catch (error) {
        toast.error("Xóa thành viên thất bại!");
      }
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
    formData.append("membershipLevel", form.membershipLevel);
    if (form.avatar instanceof File) {
      formData.append("file", form.avatar);
    }
    if (!isEdit) {
      formData.append("username", form.username);
      formData.append("password", form.password);
    } else if (isAdmin) {
      if (form.username) {
        formData.append("username", form.username);
      }
      if (form.password) {
        formData.append("password", form.password);
      }
    }

    try {
      if (form.id) {
        await updateMember(formData);
        toast.success("Cập nhật thành viên thành công!");
      } else {
        await addMember(formData);
        toast.success("Thêm thành viên thành công!");
      }
      fetchMembers();
      setForm(initialForm);
      setShowModal(false);
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error.response.data);
      toast.error( error.response.data);
    }
  };

  const handleCancel = () => {
    setForm(initialForm);
    setShowModal(false);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const filteredMembers = members.filter((member) => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && member.user.isActive) ||
      (statusFilter === "inactive" && !member.user.isActive);

    return matchesStatus;
  });

  const StatusBadge = ({ isActive }) => {
    return isActive ? (
      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 flex items-center gap-1">
        <FiCheckCircle className="inline" /> Hoạt động
      </span>
    ) : (
      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 flex items-center gap-1">
        <FiXCircle className="inline" /> Tạm ngưng
      </span>
    );
  };

  const MembershipBadge = ({ level }) => {
    const styles = {
      Basic: "bg-blue-100 text-blue-800",
      Premium: "bg-purple-100 text-purple-800",
      Gold: "bg-yellow-100 text-yellow-800",
      Platinum: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full ${
          styles[level] || styles.Basic
        }`}
      >
        {level}
      </span>
    );
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        Quản lý Bạn đọc
      </h2>

      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div>
            <span className="text-sm text-gray-600">Số mục mỗi trang:</span>
            <input
              type="number"
              list="page-size-options"
              value={size}
              min={1}
              onChange={(e) => {
                setSize(Number(e.target.value));
                setPage(0);
              }}
              className="border border-gray-300 rounded px-2 py-1 w-20"
            />
          </div>
          <div className="relative flex-grow">
            <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên, email, số điện thoại, địa chỉ hoặc ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <FiXCircle className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>

            <button
              onClick={() => {
                setForm(initialForm);
                setIsEdit(false);
                setShowModal(true);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 w-full md:w-auto"
            >
              <FiPlus /> Thêm Bạn đọc
            </button>
          </div>
        </div>

        <div className="mt-3 text-sm text-gray-600">
          {keyword && (
            <span className="ml-2">
              cho từ khóa "<strong>{keyword}</strong>"
            </span>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-lg shadow-lg overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-indigo-700">
                  {isEdit ? "Cập nhật bạn đọc" : "Thêm bạn đọc mới"}
                </h3>
                <button
                  onClick={handleCancel}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  &times;
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <img
                    src={
                      form.avatar instanceof File
                        ? URL.createObjectURL(form.avatar)
                        : form.avatar || "/default-avatar.png"
                    }
                    alt="Avatar Preview"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    Thông tin cá nhân
                  </h4>
                  <p className="text-sm text-gray-600">
                    Cập nhật avatar và thông tin cơ bản của thành viên
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleInputChange}
                    placeholder="Nhập họ"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleInputChange}
                    placeholder="Nhập tên"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    placeholder="example@email.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    placeholder="0123456789"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleInputChange}
                    placeholder="Nhập địa chỉ đầy đủ"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cấp độ thành viên
                  </label>
                  <select
                    name="membershipLevel"
                    value={form.membershipLevel}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                    <option value="Basic">Basic</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={form.isActive}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Hoạt động
                    </span>
                  </label>
                </div>
              </div>

              {(!isEdit || (isEdit && currentUser?.role === "Admin")) && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={form.username || ""}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={form.password || ""}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                </>
              )}

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cập nhật Avatar
                </label>
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({ ...form, avatar: e.target.files[0] })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Chọn file ảnh (JPG, PNG, GIF) - Kích thước tối đa 5MB
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed"
                >
                  {isEdit ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
            {loading && (
              <div className="fixed inset-0 bg-gray-900 bg-opacity-40 flex items-center justify-center z-[9999]">
                <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center gap-3">
                  <LoadingSpinner size={32} />
                  <span className="text-gray-700 font-medium">
                    Đang xử lý...
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg overflow-x-auto mb-4">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left text-gray-600 uppercase">
            <tr>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Avatar</th>
              <th className="py-3 px-4">Họ tên</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Điện thoại</th>
              <th className="py-3 px-4">Ngày tạo</th>
              <th className="py-3 px-4">Membership</th>
              <th className="py-3 px-4 text-center">Trạng thái</th>
              <th className="py-3 px-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center py-10">
                  <LoadingSpinner />
                </td>
              </tr>
            ) : filteredMembers.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-10 text-gray-500">
                  {searchTerm
                    ? "Không tìm thấy kết quả phù hợp."
                    : "Không có dữ liệu."}
                </td>
              </tr>
            ) : (
              filteredMembers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{u.id}</td>
                  <td className="py-3 px-4">
                    <img
                      src={u.user.avatar}
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td
                    className="py-3 px-4 text-blue-600 hover:underline cursor-pointer"
                    onClick={() => navigate(`/user/${u.id}`)}
                  >
                    {`${u.user.firstName} ${u.user.lastName}`}
                  </td>
                  <td className="py-3 px-4">{u.user.email}</td>
                  <td className="py-3 px-4">{u.user.phone || "—"}</td>
                  <td className="py-3 px-4">
                    {moment(u.user.createdAt).format("DD/MM/YYYY")}
                  </td>
                  <td className="py-3 px-4">
                    <MembershipBadge level={u.membershipLevel} />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <StatusBadge isActive={u.user.isActive} />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center items-center gap-3">
                      <button
                        onClick={() => handleEdit(u)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Sửa"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
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

      {totalPages > 1 && (
        <div className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row items-center justify-between">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />

          <div className="text-sm text-gray-600 mt-4 sm:mt-0">
            Trang {page + 1} / {totalPages || 1}
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
