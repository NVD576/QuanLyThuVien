import { useState, useContext } from 'react';
import { LibraryContext } from '../context/LibraryContext';
import BookList from '../components/BookList';
import AddBookForm from '../components/AddBookForm';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const Books = () => {
  const { handleAddBook } = useContext(LibraryContext);
  const [showForm, setShowForm] = useState(false);
  // Hàm xử lý khi submit form
  const handleSubmit = async (bookData) => {
    const success = await handleAddBook(bookData);
    if (success) {
      setShowForm(false);
    }
    return success;
  };
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Quản lý Sách</h2>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          Thêm sách mới
        </Button>
      </div>

      <BookList />

      <Modal show={showForm} onHide={() => setShowForm(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Thêm sách mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddBookForm
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)} />

        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Books;
