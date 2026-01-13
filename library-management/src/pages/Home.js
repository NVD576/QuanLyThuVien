import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBook,
  FiGrid,
  FiUsers,
  FiRepeat,
  FiBarChart2,
  FiFileText,
  FiDollarSign,
  FiUser,
  FiStar,
  FiMessageSquare,
  FiArrowUpCircle,
} from "react-icons/fi";
import { MyUserContext } from "../configs/MyContexts";

const Home = () => {
  const navigate = useNavigate();
  const user = useContext(MyUserContext);

  const sections = [
    {
      title: "Quản lý Sách",
      path: "/books",
      icon: <FiBook size={32} />,
      color: "from-blue-500 to-blue-600",
      description: "Thêm, sửa, xóa và tìm kiếm sách trong thư viện.",
      roles: ["Admin", "Librarian"],
    },
    {
      title: "Quản lý Bản in",
      path: "/printbooks",
      icon: <FiFileText size={32} />,
      color: "from-sky-500 to-sky-600",
      description: "Quản lý các bản sao vật lý của từng đầu sách.",
      roles: ["Admin", "Librarian"],
    },
    {
      title: "Quản lý Danh mục",
      path: "/categories",
      icon: <FiGrid size={32} />,
      color: "from-purple-500 to-purple-600",
      description: "Tổ chức và phân loại các đầu sách theo thể loại.",
      roles: ["Admin", "Librarian"],
    },
    {
      title: "Quản lý Bạn đọc",
      path: "/users/readers",
      icon: <FiUsers size={32} />,
      color: "from-green-500 to-green-600",
      description: "Quản lý thông tin và tài khoản của các thành viên.",
      roles: ["Admin", "Librarian"],
    },
    {
      title: "Quản lý Mượn/Trả",
      path: "/borrows",
      icon: <FiRepeat size={32} />,
      color: "from-yellow-500 to-yellow-600",
      description: "Theo dõi và xử lý các phiếu mượn trả sách.",
      roles: ["Admin", "Librarian"],
    },
    {
      title: "Quản lý Phiếu phạt",
      path: "/fines",
      icon: <FiDollarSign size={32} />,
      color: "from-orange-500 to-orange-600",
      description: "Quản lý các khoản phạt do mượn sách quá hạn.",
      roles: ["Admin", "Librarian"],
    },
        {
      title: "Nâng hạng thành viên",
      path: "/upgrade_member",
      icon: <FiArrowUpCircle size={32} />,
      color: "from-orange-500 to-orange-600",
      description: "Tăng cấp bậc thành viên để hưởng nhiều ưu đãi hơn.",
      roles: ["Admin", "Librarian"],
    },
        {
      title: "Quản lý Đánh giá",
      path: "/ratings",
      icon: <FiStar size={32} />,
      color: "from-indigo-500 to-indigo-600",
      description: "Quản lý các đánh giá sách của người đọc.",
      roles: ['Admin']
    },
    {
      title: "Quản lý Bình luận",
      path: "/comments",
      icon: <FiMessageSquare size={32} />,
      color: "from-teal-500 to-teal-600",
      description: "Quản lý các bình luận trong hệ thống.",
      roles: ['Admin']
    },
    {
      title: "Thống kê",
      path: "/stats",
      icon: <FiBarChart2 size={32} />,
      color: "from-red-500 to-red-600",
      description: "Xem các báo cáo và số liệu quan trọng của thư viện.",
      roles: ["Admin"],
    },
    {
      title: "Hỗ trợ Khách hàng",
      path: "/admin_chat",
      icon: <FiUser size={32} />,
      color: "from-slate-500 to-slate-600",
      description: "Hỗ trợ khách hàng.",
      roles: ["Admin"],
    },
    {
      title: "Quản lý Thanh toán",
      path: "/payments",
      icon: <FiDollarSign size={32} />,
      color: "from-pink-500 to-pink-600",
      description: "Quản lý các khoản thanh toán và giao dịch của thư viện.",
      roles: ["Admin"],
    },
  ];

  const filteredSections = sections.filter(
    (section) => !section.roles || section.roles.includes(user?.role)
  );

  return (
    <div className="p-1 sm:p-6 bg-gray-50 h-full">
      <div className="mb-8">
        <h1 className="ml-5 text-3xl font-bold text-gray-800">
          Chào mừng trở lại, {user?.firstName} {user?.lastName}!
        </h1>
      </div>



      <div className="ml-5 mb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredSections.map((section) => (
          <div
            key={section.title}
            onClick={() => navigate(section.path)}
            className={`relative p-6 rounded-xl shadow-lg cursor-pointer text-white bg-gradient-to-br ${section.color} overflow-hidden group transform hover:-translate-y-1 transition-transform duration-300`}
          >
            <div className="relative z-10">
              <div className="mb-4">{section.icon}</div>
              <h2 className="text-xl font-bold mb-1">{section.title}</h2>
              <p className="text-sm opacity-80">{section.description}</p>
            </div>
     
            <div className="absolute -bottom-8 -right-8 text-white/20 group-hover:scale-125 transition-transform duration-500 ease-out">
              {React.cloneElement(section.icon, { size: 100 })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
