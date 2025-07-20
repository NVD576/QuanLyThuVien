import React from "react"

function BookItem({ book, onDelete }) {
  return (
    <li className="book-item">
      <span>{book.title} - {book.author}</span>
      <button onClick={() => onDelete(book.id)}>🗑️ Xoá</button>
    </li>
  )
}

export default BookItem

