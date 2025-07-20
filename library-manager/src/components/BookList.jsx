import React from "react"
import BookItem from "./BookItem.jsx"

function BookList({ books, onDelete }) {
  if (books.length === 0) return <p>Chưa có sách nào.</p>

  return (
    <ul className="book-list">
      {books.map(book => (
        <BookItem key={book.id} book={book} onDelete={onDelete} />
      ))}
    </ul>
  )
}

export default BookList

