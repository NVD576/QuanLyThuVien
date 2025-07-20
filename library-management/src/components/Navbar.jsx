import { Link, NavLink } from 'react-router-dom';
import { FaBook, FaUsers, FaExchangeAlt, FaHome, FaChartBar } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">Thư Viện Số</Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>
                <FaHome className="me-1" /> Trang chủ
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/books">
                <FaBook className="me-1" /> Quản lý Sách
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/members">
                <FaUsers className="me-1" /> Quản lý Thành viên
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/borrow">
                <FaExchangeAlt className="me-1" /> Mượn/Trả sách
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/dashboard">
                <FaChartBar className="me-1" /> Thống kê
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
