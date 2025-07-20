import { createContext, useState, useEffect } from 'react';
import { getBooks, addBook, updateBook, deleteBook } from '../services/bookService';
import { getMembers, addMember, updateMember, deleteMember } from '../services/memberService';
import { getBorrows, borrowBook, returnBook } from '../services/borrowService';

export const LibraryContext = createContext();

export const LibraryProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [booksData, membersData, borrowsData] = await Promise.all([
        getBooks(),
        getMembers(),
        getBorrows()
      ]);
      setBooks(booksData);
      setMembers(membersData);
      setBorrows(borrowsData);
    } catch (error) {
      showNotification('Lỗi khi tải dữ liệu: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Book operations
  const handleAddBook = async (book) => {
    try {
      const newBook = await addBook(book);
      setBooks([...books, newBook]);
      showNotification('Thêm sách thành công', 'success');
      return true;
    } catch (error) {
      showNotification('Lỗi khi thêm sách: ' + error.message, 'error');
      return false;
    }
  };

  // ... (các hàm khác cho sách, thành viên và mượn/trả)

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <LibraryContext.Provider value={{
      books,
      members,
      borrows,
      loading,
      notification,
      handleAddBook,
      // ... (các hàm khác)
    }}>
      {children}
      {notification && (
        <div className={`alert alert-${notification.type} fixed-bottom mx-auto mb-3`} style={{ width: '300px' }}>
          {notification.message}
        </div>
      )}
    </LibraryContext.Provider>
  );
};
