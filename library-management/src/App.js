import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layouts/Header";
import Home from "./pages/Home";
import Books from "./pages/Books";
import Categories from "./pages/Categories";
import Members from "./pages/Members";
import Borrow from "./pages/Borrow";
import Stat from "./pages/Stat";
import NotFound from "./pages/NotFound";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { MyDispatcherContext, MyUserContext } from "./configs/MyContexts";
import { useContext, useEffect, useReducer, useState } from "react";
import myUserReducer from "./components/reducers/MyUserReducer";
import cookie from "js-cookie";
import { authApis, endpoints } from "./configs/API";
import Login from "./pages/Login";
import { BookProvider } from "./context/BookContext";
import Footer from "./components/layouts/Footer";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import { Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import LoadingSpinner from "./components/layouts/LoadingSpinner";
import Admins from "./pages/Admins";

const PrivateRoute = ({ children }) => {
  const user = useContext(MyUserContext);

  return user ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const [user, dispatch] = useReducer(myUserReducer, null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      const token = cookie.get("token");
      if (token !== undefined) {
        try {
          let res = await authApis().get(endpoints["current-user"]);
          dispatch({
            type: "login",
            payload: res.data,
          });
        } catch (err) {
          console.error("Lỗi load user từ token:", err);
        } finally {
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <MyUserContext.Provider value={user}>
      <MyDispatcherContext.Provider value={dispatch}>
        <BookProvider>
         <Router>
            <div className="flex flex-col min-h-screen">
              <Header />
              <div className="flex flex-grow">
              
                 {user&&<Sidebar />}
                <main className="main-content flex-grow-1 p-3 overflow-y-auto">
                  <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Private routes */}
                    <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
                    <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                    <Route path="/books" element={<PrivateRoute><Books /></PrivateRoute>} />
                    <Route path="/categories" element={<PrivateRoute><Categories /></PrivateRoute>} />
                    <Route path="/users/readers" element={<PrivateRoute><Members /></PrivateRoute>} />
                    <Route path="/users/admins" element={<PrivateRoute><Admins /></PrivateRoute>} />
                    <Route path="/borrows" element={<PrivateRoute><Borrow /></PrivateRoute>} />
                    <Route path="/stats" element={<PrivateRoute><Stat /></PrivateRoute>} />

                    {/* Not Found */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
              <Footer />
            </div>
          </Router>
          <Footer />
        </BookProvider>
      </MyDispatcherContext.Provider>
    </MyUserContext.Provider>
  );
};

export default App;
