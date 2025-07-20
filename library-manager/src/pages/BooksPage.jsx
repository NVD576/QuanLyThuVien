import React, { useState } from 'react';
import { useBooks } from '../contexts/BookContext';
import BookForm from '../components/BookForm';
import Modal from '../components/common/Modal';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const BooksPage = () => {
  const { books, deleteBook } = useBooks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const handleOpenModal = (book = null) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
  };

  const handleDelete = (bookId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sách này không?')) {
      deleteBook(bookId);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Sách</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center shadow-sm"
        >
          <FaPlus className="mr-2" /> Thêm Sách
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tác giả</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thể loại</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {books.map((book) => (
              <tr key={book.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{book.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.author}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.genre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleOpenModal(book)} className="text-indigo-600 hover:text-indigo-900 mr-4" title="Sửa">
                    <FaEdit size={18} />
                  </button>
                  <button onClick={() => handleDelete(book.id)} className="text-red-600 hover:text-red-900" title="Xóa">
                    <FaTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingBook ? 'Sửa thông tin Sách' : 'Thêm Sách mới'}
      >
        <BookForm 
          bookToEdit={editingBook} 
          onFormSubmit={handleCloseModal} 
        />
      </Modal>
    </div>
  );
};

export default BooksPage;
