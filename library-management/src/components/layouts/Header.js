import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaBook,
  FaUsers,
  FaExchangeAlt,
  FaHome,
  FaChartBar,
  FaBell,
  FaSignInAlt,
} from "react-icons/fa";
import { useState, useContext } from "react";
import { MyDispatcherContext, MyUserContext } from "../../configs/MyContexts"; 

const navItems = [
  { to: "/", label: "Trang chủ", icon: <FaHome />, end: true },
  { to: "/books", label: "Quản lý Sách", icon: <FaBook /> },
  { to: "/users/readers", label: "Quản lý Thành viên", icon: <FaUsers /> },
  { to: "/borrows", label: "Mượn/Trả sách", icon: <FaExchangeAlt /> },
  { to: "/dashboard", label: "Thống kê", icon: <FaChartBar /> },
];

const Header = () => {
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatcherContext);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const toggleUserMenu = () => setShowMenu((prev) => !prev);
  return (
    <nav className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-1 flex items-center justify-start ">
        <Link
          className="text-2xl text-yellow-100 font-bold tracking-wide hover:text-yellow-300 transition no-underline"
          to="/"
        >
          Thư Viện
        </Link>

        <ul className="flex gap-6 text-md font-medium mt-3">
          {navItems
            .filter((item) => {
              if (item.to === "/") return true; // Trang chủ luôn hiện
              if (!user) return false; // Chưa đăng nhập thì ẩn các mục khác
              return ["Admin", "Librarian"].includes(user.role); // Chỉ admin & thủ thư được thấy
            })
            .map(({ to, label, icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-md transition font-medium no-underline
           ${
             isActive
               ? "bg-white text-blue-600 font-semibold shadow"
               : "text-white hover:bg-blue-500 hover:text-yellow-200"
           }`
                  }
                >
                  {icon} {label}
                </NavLink>
              </li>
            ))}
        </ul>
        <div className="flex items-center gap-4 ml-auto relative">
          {user && (
            <>
              <button className="text-white hover:text-yellow-200 transition">
                <FaBell size={20} />
              </button>
              <button
                onClick={toggleUserMenu}
                className="text-white hover:text-yellow-200 transition"
              >
                <img
                  src={user.avatar || "/default-avatar.png"}
                  alt="Avatar"
                  className="w-8 h-8 rounded-fullaspect-square object-cover rounded-full"
                />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white text-black rounded-md shadow-lg py-2 z-50">
                  <p className="px-4 py-2 font-medium border-b">👤 Tài khoản</p>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      navigate("/profile");
                      setShowMenu(false);
                    }}
                  >
                    Thông tin cá nhân
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      dispatch({ type: "logout" });
                      navigate("/login");
                    }}
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </>
          )}

          {!user && (
            <>
              <NavLink
                to="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-blue-600 font-semibold hover:bg-blue-100 transition no-underline"
              >
                <FaSignInAlt /> Đăng nhập
              </NavLink>
              {/* <NavLink
                to="/register"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-400 text-white font-semibold hover:bg-yellow-500 transition no-underline"
              >
                <FaUserCircle /> Đăng ký
              </NavLink> */}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
