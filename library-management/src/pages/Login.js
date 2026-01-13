import React, { useContext, useState } from "react";
import Cookies from "js-cookie";
import Apis, { authApis, endpoints } from "../configs/API";
import { FaUser, FaLock } from "react-icons/fa";
import { MyDispatcherContext } from "../configs/MyContexts";
import { useNavigate} from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useContext(MyDispatcherContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await Apis.post(endpoints["login"], form);
      const token = res.data.token;

      if (token) {
        Cookies.set("token", token, { expires: 7, secure: true, sameSite: 'strict' });
        
        const currentUserRes = await authApis().get(endpoints["current-user"]);
        dispatch({
          type: "login",
          payload: currentUserRes.data,
        });
        
        navigate("/");
      } else {
        setError("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      setError("Tên đăng nhập hoặc mật khẩu không chính xác.");
      Cookies.remove("token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full bg-[#FDF6E3]">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#FFFBF2] rounded-2xl shadow-xl">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-[#5C5346]">
            Chào mừng trở lại 
          </h1>
          <p className="mt-2 text-[#8E806A]">
            Đăng nhập để tiếp tục khám phá thư viện
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E806A]" />
            <input
              type="text"
              name="username"
              placeholder="Tên đăng nhập"
              value={form.username}
              onChange={handleChange}
              className="w-full py-3 pl-12 pr-4 text-[#5C5346] bg-white border border-[#EAE0C8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005A7A]"
              required
              disabled={loading}
            />
          </div>
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E806A]" />
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={form.password}
              onChange={handleChange}
              className="w-full py-3 pl-12 pr-4 text-[#5C5346] bg-white border border-[#EAE0C8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005A7A]"
              required
              disabled={loading}
            />
          </div>
          
          {error && (
            <p className="text-center text-sm text-red-600 bg-red-100 p-2 rounded-lg">
              {error}
            </p>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 bg-[#005A7A] text-white font-bold rounded-xl hover:bg-[#004a63] transition duration-300 disabled:bg-[#a3b1b6]"
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </div>
        </form>
        

      </div>
    </div>
  );
};

export default Login;
