import React, { useState } from "react";
import { Button, Table, Form } from "react-bootstrap";
import Pagination from "../components/Pagination"; // <- dùng Pagination tự viết
import useBorrows from "../hooks/useBorrows";
import LoadingSpinner from "../components/layouts/LoadingSpinner";
import { Modal } from "react-bootstrap";
import moment from "moment";
import usePrintBooks from "../hooks/usePrintBooks";

const Borrow = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingBorrow, setEditingBorrow] = useState(null);

  const [formData, setFormData] = useState({
    userId: "",
    printBookId: "",
    borrowDate: "",
    dueDate: "",
    returnDate: "",
    status: "Borrowed",
  });

  const {
    borrows,
    loading,
    fetchBorrows,
    totalPages,
    addBorrow,
    updateBorrow,
    deleteBorrow,
    keyword,
    page,
    setKeyword,
    setPage,
  } = useBorrows();

  const { printBooks, fetchPrintBooksByBookId } = usePrintBooks();

  const openModalToAdd = () => {
    setEditingBorrow(null);
    setFormData({
      userId: "",
      bookId: "",
      borrowDate: moment().format("YYYY-MM-DD"),
      dueDate: moment().add(14, "days").format("YYYY-MM-DD"),
      returnDate: null,
      status: "Borrowed",
    });
    setShowModal(true);
  };

  const openModalToEdit = (borrow) => {
    setEditingBorrow(borrow);
    setFormData({
      id: borrow.id,
      userId: borrow.userId,
      printBookId: borrow.printBookId,
      borrowDate: moment(borrow.borrowDate).format("YYYY-MM-DD"),
      dueDate: moment(borrow.dueDate).format("YYYY-MM-DD"),
      returnDate: borrow.returnDate
        ? borrow.returnDate
        : null
        ? moment(borrow.returnDate).format("YYYY-MM-DD")
        : null,
      status: borrow.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xác nhận xóa?")) {
      deleteBorrow(id);
      fetchBorrows();
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingBorrow) {
        await updateBorrow(formData);
      } else {
        await addBorrow(formData);
      }
      setShowModal(false);
      setPage(0);
      fetchBorrows();
    } catch (error) {
      console.error("Lỗi khi thêm/sửa mượn sách:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // console.log("keyword", keyword);
    setPage(0);
    fetchBorrows(keyword, page);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div>
      <h2>Quản lý mượn sách</h2>
      <Form onSubmit={handleSearch} className="mb-3 d-flex">
        <Form.Control
          type="text"
          placeholder="Tìm theo tên người mượn hoặc sách..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Button type="submit" className="ms-2">
          Tìm
        </Button>
      </Form>
      {loading && <LoadingSpinner />}
      <Button className="mb-3" onClick={openModalToAdd}>
        Thêm mượn sách
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Người mượn</th>
            <th>Sách</th>
            <th>Ngày mượn</th>
            <th>Hạn trả</th>
            <th>Ngày trả</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {borrows.map((b) => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.userFullName}</td>
              <td>{b.bookTitle}</td>
              <td>{b.borrowDate}</td>
              <td>{b.dueDate}</td>
              <td>{b.returnDate || "-"}</td>
              <td>{b.status}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => openModalToEdit(b)}
                >
                  Sửa
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(b.id)}
                >
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingBorrow ? "Cập nhật mượn sách" : "Thêm mượn sách"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>ID Người mượn</Form.Label>
                <Form.Control
                  name="userId"
                  value={formData.userId || ""}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Book ID</Form.Label>
                <Form.Control
                  name="bookId"
                  value={formData.bookId || ""}
                  onChange={(e) => {
                    const newBookId = e.target.value;
                    setFormData({
                      ...formData,
                      bookId: newBookId,
                      printBookId: "",
                    });
                    fetchPrintBooksByBookId(newBookId);
                  }}
                  placeholder="Nhập Book ID"
                  
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Print Book</Form.Label>
                <Form.Select
                  name="printBookId"
                  value={formData.printBookId || ""}
                  onChange={handleChange}
                  disabled={!printBooks.length}
                  required
                >
                  <option value="">-- Chọn Print Book --</option>
                  {printBooks.map((pb) => (
                    <option key={pb.id} value={pb.id}>
                      {pb.bookTitle} (ID: {pb.id}) - {pb.status}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Ngày mượn</Form.Label>
                <Form.Control
                  type="date"
                  name="borrowDate"
                  value={formData.borrowDate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Hạn trả</Form.Label>
                <Form.Control
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Ngày trả (nếu có)</Form.Label>
                <Form.Control
                  type="date"
                  name="returnDate"
                  value={formData.returnDate || ""}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Borrowed">Mượn</option>
                  <option value="Returned">Đã trả</option>
                  <option value="Overdue">Quá hạn</option>
                  <option value="Pending">Yêu cầu mượn sách</option>
                  <option value="Cancelled">Từ chối</option>
                </Form.Select>
              </Form.Group>
              <div className="text-end">
                <Button
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                  className="me-2"
                >
                  Hủy
                </Button>
                <Button variant="primary" type="submit">
                  {editingBorrow ? "Cập nhật" : "Thêm"}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Table>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Borrow;
