import React, { useState, useEffect } from "react";
import { authApis, endpoints } from "../configs/API";
import { FaSearch, FaBookOpen, FaArrowRight, FaArrowLeft, FaTimes, FaExternalLinkAlt, FaPlus } from "react-icons/fa";
import LoadingSpinner from "../components/layouts/LoadingSpinner";

const MAX_DESC_LENGTH = 180;
const PAGE_SIZE = 10;

const Search = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [selectedBook, setSelectedBook] = useState(null);
  const [page, setPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [addingBook, setAddingBook] = useState(false);

  // Effect to handle body scroll when modal is open
  useEffect(() => {
    if (selectedBook) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedBook]);

  const handleSearch = async (newPage = 0) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query
        )}&startIndex=${newPage * PAGE_SIZE}&maxResults=${PAGE_SIZE}`
      );
      const data = await res.json();
      
      setBooks(data.items || []);
      setTotalItems(data.totalItems || 0);
      setExpanded({});
      setSelectedBook(null);
      setPage(newPage);
      
      // Scroll to top of the scrollable container
      const scrollContainer = document.querySelector('.search-container');
      if (scrollContainer) {
        scrollContainer.scrollTop = 0;
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const addBook = async () => {
    if (!selectedBook) return;
    
    setAddingBook(true);
    try {
      const info = selectedBook.volumeInfo;
      const form = new FormData();

      form.append("title", info.title || "");
      form.append("author", info.authors?.join(", ") || "");
      form.append("totalCopies", 0);
      form.append("availableCopies", 0);
      form.append("publisher", info.publisher || "");
      form.append(
        "publicationYear",
        info.publishedDate ? parseInt(info.publishedDate.substring(0, 4)) : ""
      );
      const shortDesc = (info.description || "").substring(0, 150);
      form.append("description", shortDesc);
      form.append("price", 0);
      form.append("image", info.imageLinks?.thumbnail || "");
      form.append("isActive", true);

      await authApis().post(endpoints["book-add"], form);
      setSelectedBook(null);
      alert("Thêm sách thành công vào thư viện!");
    } catch (error) {
      console.error("Add book error:", error);
      alert("Có lỗi xảy ra khi thêm sách");
    } finally {
      setAddingBook(false);
    }
  };

  const toggleExpand = (index, e) => {
    e.stopPropagation();
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleSelectBook = (book) => {
    setSelectedBook(book);
  };

  const closeModal = () => {
    setSelectedBook(null);
  };

  return (
    <div className="search-container h-full bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="min-h-full py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-2 sticky top-8 z-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <FaBookOpen className="text-indigo-600 text-2xl" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Tìm kiếm sách từ Google Books
                </h2>
              </div>
              <div className="w-full sm:w-auto flex gap-2">
                <input
                  type="text"
                  value={query}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch(0)}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Nhập tên sách, tác giả..."
                  className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                />
                <button
                  onClick={() => handleSearch(0)}
                  disabled={!query.trim()}
                  className={`px-5 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                    !query.trim()
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 shadow-md"
                  }`}
                >
                  <FaSearch /> Tìm kiếm
                </button>
              </div>
            </div>

            {loading && (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            )}

            {!loading && books.length === 0 && query && (
              <div className="text-center py-8">
                <p className="text-gray-500">Không tìm thấy kết quả phù hợp</p>
                <p className="text-sm text-gray-400 mt-2">
                  Hãy thử với từ khóa khác hoặc kiểm tra chính tả
                </p>
              </div>
            )}
          </div>

          {books.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-0">
             
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-semibold">
                    Kết quả tìm kiếm ({totalItems} sách)
                  </h3>
                  <div className="text-white text-sm">
                    Trang {page + 1}/{Math.ceil(totalItems / PAGE_SIZE)}
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-200 h-96 overflow-y-auto">
                {books.map((book, index) => {
                  const info = book.volumeInfo;
                  const desc = info.description || "";
                  const isLong = desc.length > MAX_DESC_LENGTH;
                  const isExpanded = expanded[index];

                  return (
                    <div
                      key={book.id}
                      className={`p-4 hover:bg-indigo-50 transition-colors cursor-pointer ${
                        selectedBook?.id === book.id ? "bg-indigo-100" : ""
                      }`}
                      onClick={() => handleSelectBook(book)}
                    >
                      <div className="flex gap-4">
                        {info.imageLinks?.thumbnail && (
                          <img
                            src={info.imageLinks.thumbnail.replace(
                              "http://",
                              "https://"
                            )}
                            alt={info.title}
                            className="w-16 h-24 sm:w-20 sm:h-28 object-contain rounded shadow border border-gray-200 flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-1">
                            {info.title}
                          </h3>
                          <p className="text-sm text-indigo-600 mb-1 line-clamp-1">
                            {info.authors?.join(", ") || "Tác giả không rõ"}
                          </p>
                          {info.publisher && (
                            <p className="text-xs text-gray-500 mb-2">
                              {info.publisher}
                              {info.publishedDate &&
                                ` • ${info.publishedDate.substring(0, 4)}`}
                            </p>
                          )}
                          {desc && (
                            <div className="text-sm text-gray-700">
                              <p className={isLong && !isExpanded ? "line-clamp-3" : ""}>
                                {desc}
                              </p>
                              {isLong && (
                                <button
                                  className="text-indigo-600 hover:text-indigo-800 text-xs mt-1 flex items-center gap-1"
                                  onClick={(e) => toggleExpand(index, e)}
                                >
                                  {isExpanded ? (
                                    <span>Thu gọn</span>
                                  ) : (
                                    <span>Xem thêm</span>
                                  )}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                <button
                  disabled={page === 0}
                  onClick={() => handleSearch(page - 1)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    page === 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-indigo-600 hover:bg-indigo-100"
                  }`}
                >
                  <FaArrowLeft />
                  <span>Trang trước</span>
                </button>
                <div className="text-sm text-gray-600">
                  Hiển thị {page * PAGE_SIZE + 1}-{Math.min(
                    (page + 1) * PAGE_SIZE,
                    totalItems
                  )}{" "}
                  của {totalItems}
                </div>
                <button
                  disabled={(page + 1) * PAGE_SIZE >= totalItems}
                  onClick={() => handleSearch(page + 1)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    (page + 1) * PAGE_SIZE >= totalItems
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-indigo-600 hover:bg-indigo-100"
                  }`}
                >
                  <span>Trang sau</span>
                  <FaArrowRight />
                </button>
              </div>
            </div>
          )}

          {/* Bottom padding */}
          <div className="h-20"></div>
        </div>
      </div>

      {/* Modal */}
      {selectedBook && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white z-10 border-b p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                Chi tiết sách
              </h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={closeModal}
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-6 mb-6">
                {selectedBook.volumeInfo.imageLinks?.thumbnail && (
                  <div className="flex-shrink-0">
                    <img
                      src={selectedBook.volumeInfo.imageLinks.thumbnail.replace(
                        "http://",
                        "https://"
                      )}
                      alt={selectedBook.volumeInfo.title}
                      className="w-full sm:w-48 h-auto max-h-64 object-contain rounded-lg shadow-md border border-gray-200"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {selectedBook.volumeInfo.title}
                  </h2>
                  <p className="text-indigo-600 mb-3">
                    {selectedBook.volumeInfo.authors?.join(", ") ||
                      "Tác giả không rõ"}
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-gray-500">Nhà xuất bản</p>
                      <p className="font-medium">
                        {selectedBook.volumeInfo.publisher || "Không rõ"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Năm xuất bản</p>
                      <p className="font-medium">
                        {selectedBook.volumeInfo.publishedDate || "Không rõ"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Số trang</p>
                      <p className="font-medium">
                        {selectedBook.volumeInfo.pageCount || "Không rõ"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Ngôn ngữ</p>
                      <p className="font-medium">
                        {selectedBook.volumeInfo.language
                          ? selectedBook.volumeInfo.language.toUpperCase()
                          : "Không rõ"}
                      </p>
                    </div>
                  </div>
                  <a
                    href={selectedBook.volumeInfo.infoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm mb-4"
                  >
                    <FaExternalLinkAlt /> Xem trên Google Books
                  </a>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-2">Mô tả</h4>
                <p className="text-gray-700 whitespace-pre-line">
                  {selectedBook.volumeInfo.description ||
                    "Không có mô tả chi tiết."}
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                >
                  Đóng
                </button>
                <button
                  onClick={addBook}
                  disabled={addingBook}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition shadow-md disabled:opacity-70"
                >
                  {addingBook ? (
                    "Đang thêm..."
                  ) : (
                    <>
                      <FaPlus /> Thêm vào thư viện
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;