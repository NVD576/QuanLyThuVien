import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-hot-toast";
import {
  FiPlus,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiCheckSquare,
  FiCheck,
  FiCreditCard,
} from "react-icons/fi";
import moment from "moment";

import useBorrows from "../hooks/useBorrows";
import { authApis, endpoints } from "../configs/API";

import LoadingSpinner from "../components/layouts/LoadingSpinner";
import Pagination from "../components/layouts/Pagination";
import BorrowFormModal from "../components/BorrowFormModal";
import { useNavigate } from "react-router-dom";
import { MyUserContext } from "../configs/MyContexts";

const PaymentModal = ({ isOpen, onClose, onSubmit, overdueInfo }) => {
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  if (!isOpen) return null;

  const handleSubmit = (action) => {
    onSubmit({
      action,
      paymentMethod: action === "pay" ? paymentMethod : null,
      amount: overdueInfo.fine,
      days: overdueInfo.days,
      borrowId: overdueInfo.borrowId,
      reason: overdueInfo.reason,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-bold mb-4 text-red-600">
          <FiCreditCard className="inline mr-2" />
          Sách Trả Quá Hạn
        </h3>

        <div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-gray-700 mb-2">
            <strong>Sách:</strong> {overdueInfo.bookTitle}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Số ngày quá hạn:</strong> {overdueInfo.days} ngày
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Tiền phạt:</strong> {overdueInfo.fine.toLocaleString()} VNĐ
          </p>
          <p className="text-gray-600 text-sm">
            <strong>Lý do:</strong> {overdueInfo.reason}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phương thức thanh toán
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Cash">Tiền mặt</option>
            <option value="BankTransfer">Chuyển khoản</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => handleSubmit("pay")}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <FiCreditCard />
            Thanh toán
          </button>
          <button
            onClick={() => handleSubmit("waive")}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
          >
            <FiCheck />
            Miễn phạt
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

const WaiveModal = ({ isOpen, onClose, onSubmit, fineInfo }) => {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!reason.trim()) {
      toast.error("Vui lòng nhập lý do miễn phạt");
      return;
    }
    onSubmit(reason.trim());
    setReason("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-bold mb-4 text-green-600">Miễn phạt</h3>

        <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-gray-700 mb-2">
            <strong>Sách:</strong> {fineInfo?.bookTitle}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Số tiền phạt:</strong> {fineInfo?.fine.toLocaleString()} VNĐ
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lý do miễn phạt *
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Nhập lý do miễn phạt..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md h-24 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            disabled={!reason.trim()}
          >
            Xác nhận miễn phạt
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

const Borrow = () => {
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showWaiveModal, setShowWaiveModal] = useState(false);
  const [overdueInfo, setOverdueInfo] = useState(null);
  const [editingBorrow, setEditingBorrow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [allReaders, setAllReaders] = useState([]);
  const navigate = useNavigate();
  const user = useContext(MyUserContext);
  const userRole = user?.role || "Librarian";
  const {
    borrows,
    loading,
    totalPages,
    page,
    fetchBorrows,
    setPage,
    updateBorrow,
    deleteBorrow,
    status,
    setStatus,
  } = useBorrows();

  useEffect(() => {
    const loadReaders = async () => {
      try {
        const readersRes = await authApis().get(endpoints["members"]);
    
        setAllReaders(readersRes.data.content || []);
      } catch (err) {
        console.error("Failed to load readers for modal", err);
        toast.error("Không thể tải danh sách bạn đọc.");
      }
    };
    loadReaders();
  }, []);

  useEffect(() => {
    setPage(0);
  }, [searchTerm, status, setPage]);

  const calculateFine = (dueDate, bookTitle) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = now - due - 1;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return { days: 0, fine: 0 };

    const finePerDay = 1000;
    const overday = diffDays - 1;
    return {
      days: overday,
      fine: overday * finePerDay,
      reason: `Quá hạn ${overday} ngày`,
      bookTitle: bookTitle,
    };
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };
  const handleReturn = async (borrow) => {
    if (!window.confirm("Xác nhận trả sách này?")) return;

    const now = new Date();
    const dueDate = new Date(borrow.dueDate);
    const isOverdue = now.toDateString() > dueDate.toDateString();

    if (isOverdue) {
      const fineInfo = calculateFine(borrow.dueDate, borrow.bookTitle);
      setOverdueInfo({
        ...fineInfo,
        borrowId: borrow.id,
      });
      setShowPaymentModal(true);
      return;
    }

    await processReturn(borrow, isOverdue);
  };

  const processReturn = async (
    borrow,
    isOverdue = false,
    paymentAction = null
  ) => {
    try {
      const status = isOverdue ? "Overdue" : "Returned";
      const payload = {
        id: borrow.id,
        userId: borrow.userId,
        printBookId: borrow.printBookId,
        borrowDate: borrow.borrowDate,
        dueDate: borrow.dueDate,
        returnDate: new Date().toISOString().split("T")[0],
        status: status,
      };

      await authApis().patch(endpoints["borrow-update"], payload);

      if (isOverdue && paymentAction) {
        await handleFinePayment(borrow, paymentAction);
      }

      await fetchBorrows();

      if (!paymentAction) {
        toast.success("Trả sách thành công!");
      }
    } catch (err) {
      console.error("Error returning book", err);
      toast.error("Trả sách thất bại!");
    }
  };

  const handleFinePayment = async (borrow, paymentAction) => {
    try {
      const fineRes = await authApis().get(endpoints["fine-borrow"](borrow.id));
      const pendingFine = fineRes.data;

      if (!pendingFine) {
        console.warn("Không tìm thấy Fine record để cập nhật");
        return;
      }

      const updateData = {
        id: pendingFine.id,
        borrow: { id: borrow.id },
        amount: paymentAction.action === "waive" ? 0 : pendingFine.amount ,
        status: paymentAction.action === "waive" ? "Waived" : "Paid",
        reason: paymentAction.reason
          ? paymentAction.reason
          : pendingFine.reason,
        issueDate: pendingFine.issueDate,
        paidDate: new Date().toISOString(),
        payMethod: paymentAction.paymentMethod || null,
      };
      if (paymentAction.paymentMethod==="Cash") 
        await authApis().patch(endpoints["fine-update"], updateData);
      else
        await processPayment1(updateData);
    } catch (err) {
      console.error("Error handling fine payment", err);
    }
  };
  const processPayment1 = async (updateData) => {
    try {
      const res = await authApis().get(endpoints["payment-create"], {
        params: {
          fineId: updateData.id,
          amount: updateData.amount ,
          type: "Fine",
          reason: updateData.reason,
        },
      });

      console.log(res.data);
      const { paymentUrl } = res.data;
      window.location.href = paymentUrl;
      
    } catch (err) {
      console.error("Error creating VNPay payment:", err);
      toast.error("Không thể tạo giao dịch VNPAY.");
    }
  };
  const handlePayment = async (paymentData) => {
    const borrow = borrows.find((b) => b.id === paymentData.borrowId);

    if (paymentData.action === "waive") {
      setShowPaymentModal(false);
      setShowWaiveModal(true);
    } else {
      await processReturn(borrow, true, paymentData);
      setShowPaymentModal(false);
      setOverdueInfo(null);
      toast.success(
        `Đã thanh toán phạt ${paymentData.amount.toLocaleString()} VNĐ và trả sách thành công!`
      );
    }
  };

  const handleWaiveFine = async (reason) => {
    const borrow = borrows.find((b) => b.id === overdueInfo.borrowId);
    const waiveData = {
      action: "waive",
      amount: overdueInfo.fine,
      reason: reason,
      borrowId: overdueInfo.borrowId,
    };

    await processReturn(borrow, true, waiveData);
    setShowWaiveModal(false);
    setOverdueInfo(null);
    toast.success("Đã miễn phạt và trả sách thành công!");
  };

  const handleApprove = async (borrowId) => {
    if (!window.confirm("Xác nhận duyệt phiếu mượn này?")) return;

    try {
      const borrow = borrows.find((b) => b.id === borrowId);
      const payload = {
        id: borrow.id,
        userId: borrow.userId,
        printBookId: borrow.printBookId,
        borrowDate: moment().format("YYYY-MM-DD"),
        dueDate: moment().add(14, "days").format("YYYY-MM-DD"),
        returnDate: null,
        status: "Borrowed",
      };

      await authApis().patch(endpoints["borrow-update"], payload);
      await fetchBorrows();
      toast.success("Duyệt phiếu mượn thành công!");
    } catch (err) {
      console.error("Error approving borrow", err);
      toast.error("Duyệt phiếu mượn thất bại!");
    }
  };

  const handleReject = async (borrowId) => {
    if (!window.confirm("Xác nhận từ chối phiếu mượn này?")) return;

    try {
      const borrow = borrows.find((b) => b.id === borrowId);
      const payload = {
        id: borrow.id,
        userId: borrow.userId,
        printBookId: borrow.printBookId,
        borrowDate: borrow.borrowDate,
        dueDate: borrow.dueDate,
        returnDate: null,
        status: "Cancelled",
      };

      await authApis().patch(endpoints["borrow-update"], payload);
      await fetchBorrows();
      toast.success("Từ chối phiếu mượn thành công!");
    } catch (err) {
      console.error("Error rejecting borrow", err);
      toast.error("Từ chối phiếu mượn thất bại!");
    }
  };

  const filteredBorrows = borrows.filter((b) => {
    const term = searchTerm.toLowerCase();
    const userName = b.userFullName?.toLowerCase() || "";
    const bookTitle = b.bookTitle?.toLowerCase() || "";
    return userName.includes(term) || bookTitle.includes(term);
  });

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const openModalToAdd = () => {
    setEditingBorrow(null);
    setShowModal(true);
  };

  const openModalToEdit = (borrow) => {
    const originalBorrow = borrows.find((b) => b.id === borrow.id);
    setEditingBorrow(originalBorrow);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa phiếu mượn này không?\nHành động này sẽ xoá cả các bản ghi liên quan như tiền phạt (nếu có).")) {
      const promise = deleteBorrow(id);
      toast.promise(promise, {
        loading: "Đang xóa...",
        success: "Xóa thành công!",
        error: "Xóa thất bại.",
      });
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingBorrow) {
        await updateBorrow(formData);
        toast.success("Cập nhật thành công!");
      } else {
        await authApis().post(endpoints["borrow-add"], formData);
        toast.success("Thêm phiếu mượn thành công!");
        await fetchBorrows();
      }
      setShowModal(false);
    } catch (err) {
      console.error("Error submitting borrow", err);
      toast.error("Có lỗi xảy ra: " + (err.response?.data || err.message));
    }
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      Borrowed: "bg-blue-100 text-blue-800",
      Returned: "bg-green-100 text-green-800",
      Overdue: "bg-red-100 text-red-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Cancelled: "bg-gray-100 text-gray-800",
    };
    return (
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full ${
          styles[status] || styles.Cancelled
        }`}
      >
        {status}
      </span>
    );
  };

  const renderTopActionButtons = (borrow) => {
    if (!userRole) return null;

    return (
      <div className="flex justify-center items-center gap-2 mb-1">
        {borrow.status === "Pending" && (
          <>
            <button
              onClick={() => handleApprove(borrow.id)}
              className="text-green-600 hover:text-green-800 px-2 py-1 bg-green-50 rounded text-xs font-medium"
              title="Duyệt"
            >
              Duyệt
            </button>
            <button
              onClick={() => handleReject(borrow.id)}
              className="text-red-600 hover:text-red-800 px-2 py-1 bg-red-50 rounded text-xs font-medium"
              title="Từ chối"
            >
              Từ chối
            </button>
          </>
        )}

        {borrow.status === "Borrowed" && (
          <button
            onClick={() => handleReturn(borrow)}
            className="text-green-600 hover:text-green-800 px-2 py-1 bg-green-50 rounded text-xs font-medium"
            title="Trả sách"
          >
            <FiCheckSquare className="inline mr-1" />
            Trả sách
          </button>
        )}
      </div>
    );
  };

  const renderBottomActionButtons = (borrow) => {
    if (!userRole) return null;

    return (
      <div className="flex justify-center items-center gap-2 mt-1">
        {userRole === "Admin" && (
          <>
            <button
              onClick={() => openModalToEdit(borrow)}
              className="text-blue-600 hover:text-blue-800 p-1"
              title="Sửa"
            >
              <FiEdit />
            </button>

            <button
              onClick={() => handleDelete(borrow.id)}
              className="text-red-600 hover:text-red-800 p-1"
              title="Xóa"
            >
              <FiTrash2 />
            </button>
          </>
        )}
      </div>
    );
  };
  //////////////////////////////////
  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        Quản lý Mượn - Trả Sách
      </h2>

      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow">
            <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên bạn đọc, tên sách..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={() => setPage(0)}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg w-full md:w-auto hover:bg-indigo-700"
          >
            Tìm kiếm
          </button>

          <button
            onClick={openModalToAdd}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 w-full md:w-auto hover:bg-green-700"
          >
            <FiPlus /> Thêm Phiếu
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="relative w-full md:w-48">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="Borrowed">Đang mượn</option>
              <option value="Returned">Đã trả</option>
              <option value="Overdue">Quá hạn</option>
              <option value="Pending">Đang chờ</option>
              <option value="Cancelled">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      <BorrowFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        editingBorrow={editingBorrow}
        allReaders={allReaders}
      />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setOverdueInfo(null);
        }}
        onSubmit={handlePayment}
        overdueInfo={overdueInfo}
      />

      <WaiveModal
        isOpen={showWaiveModal}
        onClose={() => {
          setShowWaiveModal(false);
          setOverdueInfo(null);
        }}
        onSubmit={handleWaiveFine}
        fineInfo={overdueInfo}
      />

      <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left text-gray-600 uppercase">
            <tr>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Bạn đọc</th>
              <th className="py-3 px-4">Sách</th>
              <th className="py-3 px-4">Ngày mượn</th>
              <th className="py-3 px-4">Hạn trả</th>
              <th className="py-3 px-4">Ngày trả</th>
              <th className="py-3 px-4 text-center">Trạng thái</th>
              <th className="py-3 px-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-10">
                  <LoadingSpinner />
                </td>
              </tr>
            ) : filteredBorrows.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-10 text-gray-500">
                  Không có dữ liệu.
                </td>
              </tr>
            ) : (
              filteredBorrows.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{b.id}</td>
                  <td
                    className="py-3 px-4 text-blue-600 hover:underline cursor-pointer"
                    onClick={() => navigate(`/user/${b.userId}`)}
                  >
                    {b.userFullName}
                  </td>
                  <td className="py-3 px-4" title={b.bookTitle}>
                    {truncateText(b.bookTitle, 20)}
                  </td>
                  <td className="py-3 px-4">
                    {moment(b.borrowDate).format("DD/MM/YYYY")}
                  </td>
                  <td className="py-3 px-4">
                    {moment(b.dueDate).format("DD/MM/YYYY")}
                  </td>
                  <td className="py-3 px-4">
                    {b.returnDate
                      ? moment(b.returnDate).format("DD/MM/YYYY")
                      : "—"}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="py-3 px-4 text-center">
                    {renderTopActionButtons(b)}
                    {renderBottomActionButtons(b)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default Borrow;
