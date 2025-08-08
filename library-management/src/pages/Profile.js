import React, { useContext, useEffect, useState } from "react";
import { MyDispatcherContext, MyUserContext } from "../configs/MyContexts";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
} from "react-icons/fa";
import Cookies from "js-cookie";
import LoadingSpinner from "../components/layouts/LoadingSpinner"; // Assuming you have a LoadingSpinner component
import { authApis, endpoints } from "../configs/API";

const Profile = () => {
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatcherContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]); 

  if (!user) {
    return (
      <div className="text-center mt-20">
        Vui lòng đăng nhập để xem thông tin cá nhân.
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Gọi API cập nhật thông tin
      console.log("Cập nhật thông tin:", formData);
      const form = new FormData();
      form.append("email", formData.email);
      form.append("firstName", formData.firstName);
      form.append("lastName", formData.lastName);
      form.append("phone", formData.phone);
      form.append("address", formData.address);
      if (formData.password) form.append("password", formData.password);
      if (formData.file) form.append("file", formData.file);

      const res = await authApis().patch(
        endpoints["update-profile"](user.id),
        form
      );
      console.log("Cập nhật thành công:", res.data);
      dispatch({
        type: "login",
        payload: res.data,
      });
      // Reset file input
      setIsEditing(false);
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    dispatch({ type: "logout" });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">

        <div className="bg-blue-600 py-6 px-8 text-white">
          <h1 className="text-2xl font-bold">Thông Tin Cá Nhân</h1>
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4">
                {formData.file ? (
                  <img
                    src={URL.createObjectURL(formData.file)}
                    alt="New Avatar Preview"
                    className="w-full h-full object-cover"
                  />
                ) : user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="text-gray-400 text-5xl" />
                )}
              </div>
              {isEditing && (
                <button
                  className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition"
                  onClick={() => document.getElementById("avatarInput").click()}
                >
                  Đổi ảnh đại diện
                </button>
              )}
              <input
                type="file"
                id="avatarInput"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFormData((prev) => ({
                      ...prev,
                      file: e.target.files[0],
                    }));
                  }
                }}
              />
            </div>

            {/* Info Section */}
            <div className="w-full md:w-2/3">
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="form-group">
                      <label className="block text-gray-700 mb-2">Họ</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div className="form-group">
                      <label className="block text-gray-700 mb-2">Tên</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div className="form-group">
                      <label className="block text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        disabled
                      />
                    </div>
                    <div className="form-group">
                      <label className="block text-gray-700 mb-2">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div className="form-group md:col-span-2">
                      <label className="block text-gray-700 mb-2">
                        Địa chỉ
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                      Lưu thay đổi
                    </button>

                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                      onClick={() => setIsEditing(false)}
                    >
                      Hủy
                    </button>
                  </div>
                  {loading && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <LoadingSpinner />
                    </div>
                  )}
                </form>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center">
                      <FaUser className="text-gray-400 mr-3" />
                      <div>
                        <p className="text-gray-500 text-sm">Họ và tên</p>
                        <p className="font-medium">{`${user.lastName} ${user.firstName}`}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaEnvelope className="text-gray-400 mr-3" />
                      <div>
                        <p className="text-gray-500 text-sm">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaPhone className="text-gray-400 mr-3" />
                      <div>
                        <p className="text-gray-500 text-sm">Số điện thoại</p>
                        <p className="font-medium">
                          {user.phone || "Chưa cập nhật"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="text-gray-400 mr-3" />
                      <div>
                        <p className="text-gray-500 text-sm">Địa chỉ</p>
                        <p className="font-medium">
                          {user.address || "Chưa cập nhật"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center gap-2"
                    >
                      <FaEdit /> Chỉnh sửa
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
