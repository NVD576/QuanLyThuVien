import React, { useState } from "react";
import LoadingSpinner from "./layouts/LoadingSpinner";  
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
  

  const handleSearch = async (newPage = 0) => {
    setLoading(true);
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
    window.scrollTo({ top: 0, behavior: "smooth" });
    setLoading(false);
  };

  const toggleExpand = (index) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleSelectBook = (book) => {
    setSelectedBook(book);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-blue-700 flex items-center gap-2">
          Tìm sách với Google Book{" "}
        </h2>
        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={query}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch(0);
            }}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nhập tên sách..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={() => handleSearch(0)}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Tìm kiếm
          </button>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : books.length === 0 ? (
          <p className="text-gray-500 text-center">Không có kết quả nào</p>
        ) : null}
        
        <div>
          {books.map((book, index) => {
            const info = book.volumeInfo;
            const desc = info.description || "";
            const isLong = desc.length > MAX_DESC_LENGTH;
            const isExpanded = expanded[index];

            return (
              <div
                key={index}
                className="flex gap-4 items-center border-b border-gray-200 py-4 cursor-pointer hover:bg-gray-100 rounded transition"
                onClick={() => handleSelectBook(book)}
              >
                {info.imageLinks?.thumbnail && (
                  <img
                    src={info.imageLinks.thumbnail}
                    alt="Bìa sách"
                    className="w-20 h-28 object-cover rounded shadow"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {info.title}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Tác giả: {info.authors?.join(", ") || "Không rõ"}
                  </p>
                  {desc && (
                    <div className="text-gray-700 text-sm">
                      {isLong && !isExpanded
                        ? desc.slice(0, MAX_DESC_LENGTH) + "..."
                        : desc}
                      {isLong && (
                        <button
                          className="ml-2 text-blue-600 hover:underline text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(index);
                          }}
                        >
                          {isExpanded ? "Thu gọn" : "Xem thêm"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {books.length > 0 && (
          <div className="flex justify-between items-center mt-6">
            <button
              disabled={page === 0}
              onClick={() => handleSearch(page - 1)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                page === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Trang trước
            </button>
            <span className="text-sm text-gray-600">
              Trang {page + 1} / {Math.ceil(totalItems / PAGE_SIZE)}
            </span>
            <button
              disabled={(page + 1) * PAGE_SIZE >= totalItems}
              onClick={() => handleSearch(page + 1)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                (page + 1) * PAGE_SIZE >= totalItems
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Trang sau
            </button>
          </div>
        )}
        {selectedBook && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full relative overflow-y-auto max-h-[80vh]">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
                onClick={() => setSelectedBook(null)}
              >
                &times;
              </button>
              <div className="flex gap-4 items-center mb-4">
                {selectedBook.volumeInfo.imageLinks?.thumbnail && (
                  <img
                    src={selectedBook.volumeInfo.imageLinks.thumbnail}
                    alt="Bìa sách"
                    className="w-32 h-44 object-cover rounded shadow"
                  />
                )}
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    {selectedBook.volumeInfo.title}
                  </h3>
                  <p className="mb-2 text-gray-600">
                    Tác giả:{" "}
                    {selectedBook.volumeInfo.authors?.join(", ") || "Không rõ"}
                  </p>
                </div>
              </div>
              <div className="text-gray-700 text-sm whitespace-pre-line">
                {selectedBook.volumeInfo.description || "Không có mô tả"}
              </div>
              <a
                href={selectedBook.volumeInfo.infoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-4 text-blue-600 hover:underline text-sm"
              >
                Xem trên Google Books
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
