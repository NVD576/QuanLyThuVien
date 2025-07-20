import React, { useState, useEffect } from 'react';
import { useBooks } from '../contexts/BookContext';

const BookForm = ({ bookToEdit, onFormSubmit }) => {
  const { addBook, updateBook } = useBooks();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    quantity: '',
  });

  const isEditing = !!bookToEdit;

  useEffect(() => {
    if (isEditing) {
      setFormData(bookToEdit);
    } else {
      // Reset form for adding new book
      setFormData({ title: '', author: '', genre: '', quantity: '' });
    }
  }, [bookToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateBook(formData);
    } else {
      addBook(formData);
    }
    onFormSubmit(); // Close modal and refresh
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Tiêu đề</label>
        <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
      </div>
      <div className="mb-4">
        <label htmlFor="author" className="block text-sm font-medium text-gray-700">Tác giả</label>
        <input type="text" name="author" id="author" value={formData.author} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
      </div>
      <div className="mb-4">
        <label htmlFor="genre" className="block text-sm font-medium text-gray-700">Thể loại</label>
        <input type="text" name="genre" id="genre" value={formData.genre} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
      </div>
      <div className="mb-4">
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Số lượng</label>
        <input type="number" name="quantity" id="quantity" value={formData.quantity} onChange={handleChange} required min="0" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
      </div>
      <div className="flex justify-end pt-4">
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
          {isEditing ? 'Cập nhật Sách' : 'Thêm Sách'}
        </button>
      </div>
    </form>
  );
};

export default BookForm;
