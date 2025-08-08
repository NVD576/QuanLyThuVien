import { useContext } from "react";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";
import LoadingSpinner from "./layouts/LoadingSpinner";
import { FaEdit, FaTrash, FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BookContext } from "../context/BookContext";

const BookList = ({ handleEditBook }) => {
  const {
    books,
    loading,
    deleteBook,
    currentPage,
    totalPages,
    setCurrentPage,
    searchTerm,
  } = useContext(BookContext);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white">
        <h5 className="mb-0">Danh sách Sách</h5>
      </div>
      <div className="card-body">
        <SearchBar placeholder="Tìm sách theo tên.." />

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Mã sách</th>
                <th>Tên sách</th>
                <th>Tác giả</th>
                <th>Nhà xuất bản</th>
                <th>Năm XB</th>
                <th>Số lượng</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {books.length > 0 ? (
                books.map((book) => (
                  <tr key={book.id}>
                    <td>{book.id || "N/A"}</td>
                    <td>{book.code}</td>
                    <td>
                      <Link
                        to={`/books/${book._id}`}
                        className="text-decoration-none"
                      >
                        {book.title}
                      </Link>
                    </td>
                    
                    <td>{book.author}</td>
                    <td>{book.publisher}</td>
                    <td>{book.publicationYear}</td>
                    <td>{book.totalCopies}</td>
                    <td>
                      <span
                        className={`badge ${
                          book.availableCopies > 0 ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {book.availableCopies > 0 ? "Có sẵn" : "Hết sách"}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEditBook(book)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteBook(book.id)}
                        >
                          <FaTrash />
                        </button>
                        <Link
                          to={`/books/${book._id}`}
                          className="btn btn-sm btn-outline-info"
                        >
                          <FaInfoCircle />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    {searchTerm
                      ? "Không tìm thấy sách phù hợp"
                      : "Không có sách nào"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default BookList;
