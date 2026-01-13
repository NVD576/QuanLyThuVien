import React, { useContext, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
    FiHome, FiBook, FiGrid, FiUsers, FiRepeat, FiBarChart2, FiUser, 
    FiLogOut, FiChevronDown, FiFileText, FiDollarSign, FiMessageSquare, FiStar, FiSettings, 
    FiCreditCard,
    FiArrowUpCircle,
    FiMessageCircle
} from "react-icons/fi";
import cookie from "js-cookie";
import { MyDispatcherContext, MyUserContext } from "../../configs/MyContexts";

const Sidebar = ({ collapsed, isMobile, onClose }) => {
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatcherContext);
    const location = useLocation();

    const [openMenus, setOpenMenus] = useState({
        users: location.pathname.startsWith('/users'),
        management: ['/borrows', '/fines', '/comments', '/ratings'].some(path => location.pathname.startsWith(path))
    });

    const toggleMenu = (menu) => {
        
        if (collapsed && !isMobile) return;
        setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
    };

    const handleLogout = () => {
        cookie.remove("token");
        dispatch({ type: "logout" });
    };

    const handleItemClick = () => {
        if (isMobile && onClose) {
            onClose();
        }
    };

    const navLinks = [
        { path: "/", text: "Trang chủ", icon: <FiHome />, roles: ['Admin', 'Librarian', 'Reader'] },
        { path: "/googlebooks", text: "Tìm sách với Google", icon: <FiGrid />, roles: ['Admin', 'Librarian'] },
        { path: "/books", text: "Quản lý Sách", icon: <FiBook />, roles: ['Admin', 'Librarian'] },
        { path: "/printbooks", text: "Quản lý Bản in", icon: <FiFileText />, roles: ['Admin', 'Librarian'] },
        { path: "/categories", text: "Quản lý Danh mục", icon: <FiGrid />, roles: ['Admin','Librarian'] },
        { 
            text: "Quản lý User", 
            icon: <FiUsers />,
            menuKey: 'users',
            isActive: location.pathname.startsWith('/users'),
            roles: ['Admin', 'Librarian'],
            submenu: [
                { path: "/users/admins", text: "Quản lý Admin", roles: ['Admin'] },
                { path: "/users/librarians", text: "Quản lý Thủ thư", roles: ['Admin'] },
                { path: "/users/readers", text: "Quản lý thành viên", roles: ['Admin', 'Librarian'] },
            ]
        },
        {
            text: "Nghiệp vụ",
            icon: <FiSettings />,
            menuKey: 'management',
            isActive: ['/borrows', '/fines', '/comments', '/ratings'].some(path => location.pathname.startsWith(path)),
            roles: ['Admin', 'Librarian', 'Reader'],
            submenu: [
                { path: "/borrows", text: "Mượn-Trả", icon: <FiRepeat />, roles: ['Admin', 'Librarian'] },
                { path: "/fines", text: "Phiếu phạt", icon: <FiDollarSign />, roles: ['Admin', 'Librarian'] },
                { path: "/upgrade_member", text: "Nâng hạng", icon: <FiArrowUpCircle />, roles: ['Admin', 'Librarian'] },
                { path: "/comments", text: "Bình luận", icon: <FiMessageSquare />, roles: ['Admin'] },
                { path: "/ratings", text: "Đánh giá", icon: <FiStar />, roles: ['Admin'] },
                { path: "/payments", text: "Thanh toán", icon: <FiCreditCard />, roles: ['Admin','Librarian'] },
                { path: "/admin_chat", text: "Hỗ trợ", icon: <FiMessageCircle />, roles: ['Admin'] },
            ]
        },
        { path: "/stats", text: "Thống kê", icon: <FiBarChart2 />, roles: ['Admin'] },
        { path: "/profile", text: "Trang cá nhân", icon: <FiUser />, roles: ['Admin', 'Librarian'] },
    ];

    const filteredNavLinks = navLinks.map(link => {
        if (link.submenu) {
            const filteredSubmenu = link.submenu.filter(sub => 
                !sub.roles || sub.roles.includes(user?.role)
            );
            return { ...link, submenu: filteredSubmenu };
        }
        return link;
    }).filter(link => {
        if (link.submenu && link.submenu.length === 0) {
            return false;
        }
        return !link.roles || link.roles.includes(user?.role);
    });

    const navLinkClasses = ({ isActive }) =>
        `flex items-center p-3 rounded-lg transition-colors duration-200 ease-in-out no-underline ${
            collapsed && !isMobile ? 'justify-center' : ''
        } ${
        isActive
            ? 'bg-blue-600 text-white font-medium'
            : 'text-slate-400 hover:bg-slate-700 hover:text-white'
        }`;
    
    const subNavLinkClasses = ({ isActive }) =>
        `flex items-center gap-4 p-2 pl-14 text-sm relative transition-colors duration-200 ease-in-out rounded-md no-underline ${
        isActive
            ? 'text-white font-semibold'
            : 'text-slate-400 hover:text-white'
        }`;

    return (
        <div className={`
            ${collapsed && !isMobile ? 'w-16' : 'w-[260px]'} 
            bg-slate-800 flex flex-col h-screen sticky top-[56px] flex-shrink-0
            ${isMobile ? 'fixed left-0 top-0 z-50 shadow-lg' : ''}
            transition-all duration-300 ease-in-out
        `}>
            <div className={`
                p-4 flex items-center border-b border-slate-700
                ${collapsed && !isMobile ? 'justify-center px-2' : ''}
            `}>
                {(!collapsed || isMobile) ? (
                    <>
                        <img 
                            src={user?.avatar || "/default-avatar.png"} 
                            alt="avatar" 
                            className="w-10 h-10 rounded-full object-cover mr-3 border-2 border-slate-600" 
                        />
                        <span className="font-semibold text-base text-white truncate">
                            {`${user?.firstName || user?.first_name || ''} ${user?.lastName || user?.last_name || ''}`}
                        </span>
                    </>
                ) : (
                    <img 
                        src={user?.avatar || "/default-avatar.png"} 
                        alt="avatar" 
                        className="w-8 h-8 rounded-full object-cover border-2 border-slate-600" 
                        title={`${user?.firstName || user?.first_name || ''} ${user?.lastName || user?.last_name || ''}`}
                    />
                )}
            </div>
            
            <div className="flex-grow flex flex-col overflow-y-auto">
                <nav className="p-2 space-y-1"> 
                    {filteredNavLinks.map((link) => (
                        <div key={link.text}>
                            {link.submenu ? (
                                <>
                                    <button
                                        onClick={() => toggleMenu(link.menuKey)}
                                        disabled={collapsed && !isMobile}
                                        className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 ease-in-out text-left ${
                                            collapsed && !isMobile ? 'justify-center' : ''
                                        } ${
                                            link.isActive
                                                ? 'bg-slate-700 text-white font-medium'
                                                : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                                        }`}
                                        title={collapsed && !isMobile ? link.text : ''}
                                    >
                                        <span className={`text-xl flex items-center ${
                                            collapsed && !isMobile ? '' : 'mr-4'
                                        }`}>
                                            {link.icon}
                                        </span>
                                        {(!collapsed || isMobile) && (
                                            <>
                                                <span className="flex-grow">{link.text}</span>
                                                <FiChevronDown className={`transition-transform duration-300 ${
                                                    openMenus[link.menuKey] ? 'rotate-180' : ''
                                                }`} />
                                            </>
                                        )}
                                    </button>
                                    {(!collapsed || isMobile) && (
                                        <div className={`overflow-hidden transition-all duration-300 ease-in-out bg-black/20 rounded-lg mt-1 ${
                                            openMenus[link.menuKey] ? 'max-h-96' : 'max-h-0'
                                        }`}>
                                            {link.submenu.map((sub) => (
                                                <NavLink 
                                                    to={sub.path} 
                                                    key={sub.path} 
                                                    className={subNavLinkClasses}
                                                    onClick={handleItemClick}
                                                >
                                                    {sub.icon && <span className="text-lg">{sub.icon}</span>}
                                                    <span>{sub.text}</span>
                                                </NavLink>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <NavLink 
                                    to={link.path} 
                                    className={navLinkClasses} 
                                    end
                                    onClick={handleItemClick}
                                    title={collapsed && !isMobile ? link.text : ''}
                                >
                                    <span className={`text-xl flex items-center ${
                                        collapsed && !isMobile ? '' : 'mr-4'
                                    }`}>
                                        {link.icon}
                                    </span>
                                    {(!collapsed || isMobile) && <span>{link.text}</span>}
                                </NavLink>
                            )}
                        </div>
                    ))}
                </nav>

                <div className={`mt-0 p-4 border-t border-slate-700 ${
                    collapsed && !isMobile ? 'px-2' : ''
                }`}>
                    <button 
                        onClick={() => {
                            handleLogout();
                            handleItemClick();
                        }} 
                        className={`flex items-center gap-3 w-full p-3 border border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-500 hover:text-white transition-colors duration-200 ${
                            collapsed && !isMobile ? 'justify-center' : 'justify-center'
                        }`}
                        title={collapsed && !isMobile ? 'Đăng xuất' : ''}
                    >
                        <FiLogOut />
                        {(!collapsed || isMobile) && <span>Đăng xuất</span>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;