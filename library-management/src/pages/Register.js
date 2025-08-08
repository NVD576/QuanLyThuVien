import React, { useState } from "react";
import Apis, { endpoints } from "../configs/API";
import LoadingSpinner from "../components/layouts/LoadingSpinner";

const Register = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
    avatar: null,
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setForm({ ...form, [name]: file });
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu không khớp.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("firstName", form.firstName);
      formData.append("lastName", form.lastName);
      formData.append("email", form.email);
      formData.append("address", form.address);
      formData.append("phone", form.phone);
      formData.append("username", form.username);
      formData.append("password", form.password);
      if (form.avatar) formData.append("file", form.avatar);

      await Apis.post(endpoints["register"], formData);

      setSuccess("Đăng ký thành công!");
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        phone: "",
        username: "",
        password: "",
        confirmPassword: "",
        avatar: null,
      });
      setAvatarPreview(null);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-md p-8 rounded">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        Đăng ký tài khoản
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>
      )}
      {success && (
        <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">
          {success}
        </div>
      )}
      {loading && <LoadingSpinner />}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="Họ"
            className="border px-4 py-2 rounded w-full"
            required
          />
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Tên"
            className="border px-4 py-2 rounded w-full"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border px-4 py-2 rounded w-full"
            required
          />
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Địa chỉ"
            className="border px-4 py-2 rounded w-full"
            required
          />
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Số điện thoại"
            className="border px-4 py-2 rounded w-full"
            required
          />
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Tên đăng nhập"
            className="border px-4 py-2 rounded w-full"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Mật khẩu"
            className="border px-4 py-2 rounded w-full"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Nhập lại mật khẩu"
            className="border px-4 py-2 rounded w-full"
            required
          />
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleChange}
            className="border px-4 py-2 rounded w-full"
          />
          {avatarPreview && (
            <img
              src={avatarPreview}
              alt="Xem trước ảnh"
              className="w-32 h-32 object-cover rounded-full mx-auto border"
            />
          )}
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700"
          >
            Đăng ký
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
