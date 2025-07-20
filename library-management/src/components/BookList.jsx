import { useState, useEffect, useContext } from 'react';
import { LibraryContext } from '../context/LibraryContext';
import SearchBar from './SearchBar';
import Pagination from './Pagination';
import LoadingSpinner from './LoadingSpinner';
import { FaEdit, FaTrash, FaInfoCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const BookList = ({handleEditBook }) => {
  const { books, loading, handleDeleteBook } = useContext(LibraryContext);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8;

  useEffect(() => {
    setFilteredBooks(
      books.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setCurrentPage(1);
  }, [books, searchTerm]);

  // Get current books
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white">
        <h5 className="mb-0">Danh sách Sách</h5>
      </div>
      <div className="card-body">
        <SearchBar 
          placeholder="Tìm sách theo tên, tác giả hoặc ISBN..." 
          onSearch={setSearchTerm} 
        />
        
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Mã sách</th>
                <th>Tên sách</th>
                <th>Tác giả</th>
                <th>Năm XB</th>
                <th>Số lượng</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentBooks.length > 0 ? (
                currentBooks.map(book => (
                  <tr key={book._id}>
                    <td>{book.isbn || 'N/A'}</td>
                    <td>
                      <Link to={`/books/${book._id}`} className="text-decoration-none">
                        {book.title}
                      </Link>
                    </td>
                    <td>{book.author}</td>
                    <td>{book.publishedYear}</td>
                    <td>{book.quantity}</td>
                    <td>
                      <span className={`badge ${book.quantity > 0 ? 'bg-success' : 'bg-danger'}`}>
                        {book.quantity > 0 ? 'Có sẵn' : 'Hết sách'}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEditBook(book._id)}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteBook(book._id)}
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
                    {searchTerm ? 'Không tìm thấy sách phù hợp' : 'Không có sách nào'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredBooks.length > booksPerPage && (
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
