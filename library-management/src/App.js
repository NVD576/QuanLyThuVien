import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";

import Home from "./pages/Home";
import Books from "./pages/Books";
import Categories from "./pages/Categories";
import Members from "./pages/Members";
import Borrow from "./pages/Borrow";
import Stat from "./pages/Stat";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";

import Admins from "./pages/Admins";
import Librarians from "./pages/Librarians";
import PrintBook from "./pages/PrintBook";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { MyDispatcherContext, MyUserContext } from "./configs/MyContexts";
import { useContext, useEffect, useReducer, useState } from "react";
import myUserReducer from "./components/reducers/MyUserReducer";
import cookie from "js-cookie";
import { authApis, endpoints } from "./configs/API";
import { BookProvider } from "./context/BookContext";
import Sidebar from "./components/layouts/Sidebar";
import BookDetail from "./pages/BookDetail";
import Fines from "./pages/Fines";
import Comments from "./pages/Comments";
import Ratings from "./pages/Ratings";
import Search from "./pages/SearchGoogle";
import UserDetail from "./pages/UserDetail";
import PaymentManagement from "./pages/Payments";
import LoadingSpinner from "./components/layouts/LoadingSpinner";
import UpgradeMembership from "./pages/UpgradeMembership ";
import AdminChat from "./pages/AdminChat";
import { Toaster } from "react-hot-toast";
const PrivateRoute = ({ children }) => {
  const user = useContext(MyUserContext);
  return user ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const [user, dispatch] = useReducer(myUserReducer, null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      const token = cookie.get("token");
      if (token) {
        try {
          let res = await authApis().get(endpoints["current-user"]);
          dispatch({
            type: "login",
            payload: res.data,
          });
        } catch (err) {
          console.error("Lỗi load user từ token:", err);
          cookie.remove("token");
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <MyUserContext.Provider value={user}>
      <MyDispatcherContext.Provider value={dispatch}>
        <BookProvider>
          <Router>
            <Toaster position="top-right" />
            <div className="flex flex-col h-screen">
              <Header
                toggleSidebar={toggleSidebar}
                sidebarCollapsed={sidebarCollapsed}
                showToggle={!!user}
              />

              <div className="flex flex-1 h-full overflow-hidden relative">
                {user && (
                  <>
                    <div
                      className={`
    relative z-10
    transition-all duration-300 ease-in-out
    ${sidebarCollapsed ? "w-16" : "w-64"}
    h-full
  `}
                    >
                      <Sidebar collapsed={sidebarCollapsed} />
                    </div>
                  </>
                )}

                <main
                  className={`
                  flex-1 h-full overflow-y-auto
                  transition-all duration-300 ease-in-out
                  ${user && !sidebarCollapsed  ? "ml-0" : ""}
                `}
                >
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route
                      path="/"
                      element={
                        <PrivateRoute>
                          <Home />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <PrivateRoute>
                          <Profile />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/books"
                      element={
                        <PrivateRoute>
                          <Books />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/googlebooks"
                      element={
                        <PrivateRoute>
                          <Search />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/books/:bookId"
                      element={
                        <PrivateRoute>
                          <BookDetail />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/printbooks"
                      element={
                        <PrivateRoute>
                          <PrintBook />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/categories"
                      element={
                        <PrivateRoute>
                          <Categories />
                        </PrivateRoute>
                      }
                    />
                    <Route path="/user/:id" element={<UserDetail />} />
                    <Route
                      path="/users/readers"
                      element={
                        <PrivateRoute>
                          <Members />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/users/admins"
                      element={
                        <PrivateRoute>
                          <Admins />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/users/librarians"
                      element={
                        <PrivateRoute>
                          <Librarians />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/borrows"
                      element={
                        <PrivateRoute>
                          <Borrow />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/comments"
                      element={
                        <PrivateRoute>
                          <Comments />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/ratings"
                      element={
                        <PrivateRoute>
                          <Ratings />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/fines"
                      element={
                        <PrivateRoute>
                          <Fines />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/upgrade_member"
                      element={
                        <PrivateRoute>
                          <UpgradeMembership />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/stats"
                      element={
                        <PrivateRoute>
                          <Stat />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/payments"
                      element={
                        <PrivateRoute>
                          <PaymentManagement />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/admin_chat"
                      element={
                        <PrivateRoute>
                          <AdminChat />
                        </PrivateRoute>
                      }
                    />

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
              <Footer />
            </div>
          </Router>
        </BookProvider>
      </MyDispatcherContext.Provider>
    </MyUserContext.Provider>
  );
};

export default App;
