import { useState } from 'react';

const AddBookForm = ({ onSubmit, AddBook }) => {
  const [book, setBook] = useState({
    title: '',
    author: '',
    publishedYear: '',
    quantity: 1
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await onSubmit(book);  {/* Gọi hàm onSubmit từ props */}
      if (success) {
        // Reset form nếu thành công
        setBook({
          title: '',
          author: '',
          publishedYear: '',
          quantity: 1,
          isbn: ''
        });
      }
    } catch (error) {
      console.error('Lỗi khi thêm sách:', error);
    }
  };
  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">Thêm Sách Mới</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Tên Sách</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={book.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Tác Giả</label>
            <input
              type="text"
              className="form-control"
              name="author"
              value={book.author}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Năm Xuất Bản</label>
            <input
              type="number"
              className="form-control"
              name="publishedYear"
              value={book.publishedYear}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Số Lượng</label>
            <input
              type="number"
              className="form-control"
              name="quantity"
              value={book.quantity}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Thêm Sách
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBookForm;
