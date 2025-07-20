// src/contexts/BookContext.jsx
import React, { createContext, useState, useContext } from 'react';
import { initialBooks } from '../data/mockData';

// 1. Tạo Context
const BookContext = createContext();

// 2. Tạo Provider Component
export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState(initialBooks);

  const addBook = (book) => {
    const newBook = { ...book, id: Date.now() }; // Tạo ID duy nhất đơn giản
    setBooks([...books, newBook]);
  };

  const updateBook = (updatedBook) => {
    setBooks(
      books.map((book) => (book.id === updatedBook.id ? updatedBook : book))
    );
  };

  const deleteBook = (bookId) => {
    setBooks(books.filter((book) => book.id !== bookId));
  };

  return (
    <BookContext.Provider value={{ books, addBook, updateBook, deleteBook }}>
      {children}
    </BookContext.Provider>
  );
};

// 3. Tạo custom hook để sử dụng Context dễ dàng hơn
export const useBooks = () => {
  return useContext(BookContext);
};
