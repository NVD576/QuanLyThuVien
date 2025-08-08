import React, { useContext , useState } from "react";
import Cookies from "js-cookie";
import Apis, { authApis, endpoints } from "../configs/API";
import { FaUser, FaLock } from "react-icons/fa";
import LoadingSpinner from "../components/layouts/LoadingSpinner";
import { MyDispatcherContext } from "../configs/MyContexts";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Thêm state loading
  const dispatch = useContext(MyDispatcherContext); // Lấy dispatch từ context
  const navigate = useNavigate();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Bắt đầu loading
    try {
      console.log("Đang đăng nhập với thông tin:", form);
      const res = await Apis.post(endpoints["login"], form);
      const token = res.data.token;
      if (token) {
        Cookies.set("token", token);
        let res = await authApis().get(endpoints["current-user"]);
        dispatch({
          type: "login",
          payload: res.data,
        });
        console.log(res.data)
        setMessage(" Đăng nhập thành công!");
        navigate("/");
      } else {
        setMessage(" Đăng nhập thất bại: không có token");
      }
    } catch (err) {
      setMessage("Tài khoản hoặc mật khẩu không đúng!", err);
      Cookies.remove("token");
    }
    finally {
      setLoading(false); // Kết thúc loading
    }
    
  };

  return (
    <div className="h-[85vh] flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Đăng nhập
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
            <FaUser className="text-gray-400 mr-2" />
            <input
              type="text"
              name="username"
              placeholder="Tên đăng nhập"
              value={form.username}
              onChange={handleChange}
              className="w-full outline-none bg-transparent"
              required
              disabled={loading}
            />
          </div>
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
            <FaLock className="text-gray-400 mr-2" />
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={form.password}
              onChange={handleChange}
              className="w-full outline-none bg-transparent"
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            disabled={loading}
          >
            Đăng nhập
          </button>
          {loading && <LoadingSpinner />} {/* Hiển thị spinner khi loading */}
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-green-700 font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
