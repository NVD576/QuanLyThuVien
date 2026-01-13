import { useContext, useEffect, useState } from "react";
import BookList from "../components/BookList";
import AddBookForm from "../components/AddBookForm";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { BookContext } from "../context/BookContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Books = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const { addBook, updateBook, fetchBooks } = useContext(BookContext);
  const  navigator  = useNavigate();
  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditBook = (book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const handleSubmit = async (form) => {
    try {
      
      if (editingBook) {
        await updateBook(form);
        toast.success("Cập nhật sách thành công!");
      } else {
        await addBook(form);
        toast.success("Thêm sách thành công!");
      }
      setShowForm(false);
      setEditingBook(null);
      return true;
    } catch (err) {
      console.error("Lỗi khi lưu sách:", err);
      return false;
    }
  };
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 color-red">Quản lý Sách</h2>
        <Button variant="success" onClick={() => navigator("/categories")}>
          Quản lý danh mục
        </Button>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          Thêm sách mới
        </Button>
      </div>
      <BookList handleEditBook={handleEditBook} />

      <Modal
        show={showForm}
        onHide={() => {
          setShowForm(false);
          setEditingBook(null); 
        }}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingBook ? "Cập nhật sách" : "Thêm sách mới"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddBookForm
            book={editingBook}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingBook(null);
            }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Books;
