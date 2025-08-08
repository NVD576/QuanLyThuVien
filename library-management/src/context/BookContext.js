import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { authApis, endpoints } from "../configs/API";
import { MyUserContext } from "../configs/MyContexts";

export const BookContext = createContext();

export const BookProvider = ({ children }) => {
  const user = useContext(MyUserContext);

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortConfig, setSortConfig] = useState({
    field: "id",
    direction: "asc",
  });

  const fetchBooks = useCallback(
    async ({ search = "", cate = "" } = {}) => {
      setLoading(true);
      setError(null);

      try {
        const trimmedSearch = search?.trim();
        const trimmedCategory = cate?.trim();
        const params = new URLSearchParams({
          page: currentPage,
          size: pageSize,
          sort: `${sortConfig.field},${sortConfig.direction}`,
          search: trimmedSearch,
        });
        if (trimmedCategory) {
          params.append("category", trimmedCategory);
        }
        const response = await authApis().get(`${endpoints.books}?${params}`);
        if (response.data) {
          setBooks(response.data.content || []);
          setCurrentPage(response.data.number || 0);
          setTotalPages(response.data.totalPages || 0);
          setPageSize(response.data.size || pageSize);
        }
      } catch (err) {
        console.error("Lỗi khi lấy sách:", {
          message: err.message,
          code: err.code,
          response: err.response ? err.response.data : null,
        });
        setError(
          err.code === "ERR_NETWORK"
            ? "Không thể kết nối với server. Vui lòng kiểm tra server tại http://localhost:8080."
            : `Lỗi khi tải sách: ${err.message}`
        );
        setBooks([]);
      } finally {
        setLoading(false);
      }
    },
    [currentPage, pageSize, sortConfig]
  );

  // Gọi fetchBooks khi trang hoặc sắp xếp thay đổi
  useEffect(() => {
    if (user) fetchBooks({ search: searchTerm, cate: selectedCategory });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, currentPage, sortConfig, fetchBooks]);

  // Tìm kiếm chỉ chạy khi gọi handleSearch
  const handleSearch = ({ search, cate }) => {
    setCurrentPage(0);
    setSearchTerm(search);
    setSelectedCategory(cate);
    fetchBooks({ search, cate });
  };

  const addBook = async (newBook) => {
    try {
      setLoading(true);
      const response = await authApis().post(endpoints["book-add"], newBook);
      await fetchBooks({ search: searchTerm, cate: selectedCategory });
      return response.data;
    } catch (err) {
      console.error("Lỗi khi thêm sách:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBook = async (updatedData) => {
    try {
      setLoading(true);
      const response= await authApis().patch(
        endpoints["book-update"],
        updatedData
      );
      await fetchBooks({ search: searchTerm, cate: selectedCategory });
      return response.data;
    } catch (err) {
      console.error("Lỗi khi cập nhật sách:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (id) => {
    try {
      setLoading(true);
      await authApis().delete(endpoints["book-delete"](id));
      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (err) {
      console.error("Lỗi khi xóa sách:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    setSortConfig((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <BookContext.Provider
      value={{
        books,
        setBooks,
        loading,
        error,
        currentPage,
        totalPages,
        pageSize,
        setCurrentPage,
        fetchBooks,
        addBook,
        updateBook,
        deleteBook,
        handleSort,
        sortConfig,
        handleSearch,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};
