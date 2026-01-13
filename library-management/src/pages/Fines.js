import React, { useEffect, useState } from "react";
import { authApis, endpoints } from "../configs/API";
import {  toast } from "react-hot-toast";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiCreditCard,
  FiCheck,
} from "react-icons/fi";
import moment from "moment";
import LoadingSpinner from "../components/layouts/LoadingSpinner";
import FineFormModal from "../components/FineFormModal";
import Pagination from "../components/layouts/Pagination";
import { useContext } from "react";
import { MyUserContext } from "../configs/MyContexts";

const PaymentModal = ({ isOpen, onClose, onSubmit, fineInfo }) => {
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  if (!isOpen) return null;

  const handleSubmit = (action) => {
    onSubmit({
      action,
      paymentMethod: action === "pay" ? paymentMethod : null,
      fineId: fineInfo.id,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-bold mb-4 text-blue-600">
          <FiCreditCard className="inline mr-2" />
          Thanh toán phạt
        </h3>

        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-gray-700 mb-2">
            <strong>Phiếu mượn ID:</strong> {fineInfo.borrow?.id}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Số tiền phạt:</strong> {fineInfo.amount.toLocaleString()}{" "}
            VNĐ
          </p>
          <p className="text-gray-600 text-sm">
            <strong>Lý do:</strong> {fineInfo.reason}
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
            {/* <option value="CreditCard">Thẻ tín dụng</option>
            <option value="EWallet">Ví điện tử</option> */}
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
            <strong>Phiếu mượn ID:</strong> {fineInfo?.borrow?.id}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Số tiền phạt:</strong> {fineInfo?.amount.toLocaleString()}{" "}
            VNĐ
          </p>
          <p className="text-gray-600 text-sm">
            <strong>Lý do phạt:</strong> {fineInfo?.reason}
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

const Fines = () => {
  const [fines, setFines] = useState([]);
  const [editingFine, setEditingFine] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showWaiveModal, setShowWaiveModal] = useState(false);
  const [selectedFine, setSelectedFine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const user = useContext(MyUserContext);

  const fetchFines = async () => {
    try {
      setLoading(true);
      const res = await authApis().get(endpoints.fines, {
        params: { page, size },
      });

      const pageData = res.data;
      setFines(pageData.content || []);
      setTotalPages(pageData.totalPages || 0);
    } catch (err) {
      console.error("Lỗi tải fines:", err);
      toast.error("Không thể tải danh sách khoản phạt.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFines();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const filteredFines = fines.filter((fine) => {
    if (statusFilter === "All") return true;
    return fine.status === statusFilter;
  });

  const handleSubmit = async (formData) => {
    const isEditing = !!formData.id;
    const payload = {
      id: formData.id,
      borrowId: Number(formData.borrowId),
      amount: Number(formData.amount),
      reason: formData.reason,
      issueDate: formData.issueDate,
      paidDate: formData.paidDate || null,
      status: formData.status,
    };

    const action = isEditing
      ? authApis().patch(endpoints["fine-update"], payload)
      : authApis().post(endpoints["fine-add"], payload);

    const promise = action.then(() => {
      setShowModal(false);
      fetchFines();
    });

    toast.promise(promise, {
      loading: isEditing ? "Đang cập nhật..." : "Đang thêm mới...",
      success: isEditing
        ? "Cập nhật thành công!"
        : "Thêm khoản phạt thành công!",
      error: "Có lỗi xảy ra!",
    });
  };

  const handleEdit = (fine) => {
    setEditingFine(fine);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa khoản phạt này?")) {
      const promise = authApis()
        .delete(endpoints["fine-delete"](id))
        .then(() => fetchFines());
      toast.promise(promise, {
        loading: "Đang xóa...",
        success: "Xóa thành công!",
        error: "Xóa thất bại.",
      });
    }
  };

  const handlePaymentAction = async (paymentData) => {
    if (paymentData.action === "waive") {
      setShowPaymentModal(false);
      setShowWaiveModal(true);
    } else {
      if (paymentData.paymentMethod === "Cash")
        await processPayment(paymentData);
      else await processPayment1(paymentData);
    }
  };

  const processPayment1 = async (paymentData) => {
    try {
      const res = await authApis().get(endpoints["payment-create"], {
        params: {
          fineId: selectedFine.id,
          amount: selectedFine.amount,
          type: "Fine",
          reason: selectedFine.reason,
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

  const processPayment = async (paymentData) => {
    try {
      const updateData = {
        id: selectedFine.id,
        amount: selectedFine.amount,
        status: "Paid",
        reason: selectedFine.reason,
        issueDate: selectedFine.issueDate,
        paidDate: new Date().toISOString().split("T")[0],
        payMethod: paymentData.paymentMethod,
        borrow: { id: selectedFine.borrow.id },
      };

      await authApis().patch(endpoints["fine-update"], updateData);

      setShowPaymentModal(false);
      setSelectedFine(null);
      fetchFines();
      toast.success(
        `Thanh toán thành công ${selectedFine.amount.toLocaleString()} VNĐ!`
      );
    } catch (err) {
      console.error("Error processing payment:", err);
      toast.error(
        "Lỗi khi thanh toán: " + (err.response?.data?.message || err.message)
      );
    }
  };

  const handleWaiveFine = async (reason) => {
    try {
      const updateData = {
        id: selectedFine.id,
        amount: 0,
        status: "Waived",
        reason: reason,
        issueDate: selectedFine.issueDate,
        paidDate: new Date().toISOString().split("T")[0],
        payMethod: null,
        borrow: { id: selectedFine.borrow.id },
      };

      await authApis().patch(endpoints["fine-update"], updateData);

      setShowWaiveModal(false);
      setSelectedFine(null);
      fetchFines();
      toast.success("Miễn phạt thành công!");
    } catch (err) {
      console.error("Error waiving fine:", err);
      toast.error(
        "Lỗi khi miễn phạt: " + (err.response?.data?.message || err.message)
      );
    }
  };

  const openPaymentModal = (fine) => {
    setSelectedFine(fine);
    setShowPaymentModal(true);
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      Paid: "bg-green-100 text-green-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Waived: "bg-blue-100 text-blue-800",
    };
    return (
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full ${
          styles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  // const renderActionButtons = (fine) => {
  //   return (
  //     <div className="flex justify-center items-center gap-2">
  //       {user?.role === "Admin" && (
  //         <>
  //           <button
  //             onClick={() => handleEdit(fine)}
  //             className="text-blue-600 hover:text-blue-800 p-1"
  //             title="Sửa"
  //           >
  //             <FiEdit />
  //           </button>

  //           <button
  //             onClick={() => handleDelete(fine.id)}
  //             className="text-red-600 hover:text-red-800 p-1"
  //             title="Xóa"
  //           >
  //             <FiTrash2 />
  //           </button>
  //         </>
  //       )}

  //       {fine.status === "Pending" && (
  //         <button
  //           onClick={() => openPaymentModal(fine)}
  //           className="text-green-600 hover:text-green-800 px-2 py-1 bg-green-50 rounded text-xs font-medium ml-2"
  //           title="Thanh toán"
  //         >
  //           <FiCreditCard className="inline mr-1" />
  //           Thanh toán
  //         </button>
  //       )}
  //     </div>
  //   );
  // };
  const renderTopActionButtons = (fine) => {
    return (
      <div className="flex justify-center items-center gap-2 mb-1">
        {fine.status === "Pending" && (
          <button
            onClick={() => openPaymentModal(fine)}
            className="text-green-600 hover:text-green-800 px-2 py-1 bg-green-50 rounded text-xs font-medium"
            title="Thanh toán"
          >
            <FiCreditCard className="inline mr-1" />
            Thanh toán
          </button>
        )}
      </div>
    );
  };

  const renderBottomActionButtons = (fine) => {
    return (
      <div className="flex justify-center items-center gap-2 mt-1">
        {user?.role === "Admin" && (
          <>
            <button
              onClick={() => handleEdit(fine)}
              className="text-blue-600 hover:text-blue-800 p-1"
              title="Sửa"
            >
              <FiEdit />
            </button>

            <button
              onClick={() => handleDelete(fine.id)}
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

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
    
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Quản lý Khoản phạt
        </h2>
        <button
          onClick={() => {
            setEditingFine(null);
            setShowModal(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FiPlus /> Thêm Khoản phạt
        </button>
      </div>

      
      <div className="mb-4">
        <label htmlFor="statusFilter" className="mr-2 font-semibold">
          Lọc theo trạng thái:
        </label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-1"
        >
          <option value="All">Tất cả</option>
          <option value="Pending">Chưa thanh toán</option>
          <option value="Paid">Đã thanh toán</option>
          <option value="Waived">Miễn phạt</option>
        </select>
      </div>

      <FineFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        editingFine={editingFine}
      />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedFine(null);
        }}
        onSubmit={handlePaymentAction}
        fineInfo={selectedFine}
      />

      <WaiveModal
        isOpen={showWaiveModal}
        onClose={() => {
          setShowWaiveModal(false);
          setSelectedFine(null);
        }}
        onSubmit={handleWaiveFine}
        fineInfo={selectedFine}
      />

      <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left text-gray-600 uppercase">
            <tr>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Phiếu mượn ID</th>
              <th className="py-3 px-4">Số tiền</th>
              <th className="py-3 px-4">Lý do</th>
              <th className="py-3 px-4">Ngày tạo</th>
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
            ) : filteredFines.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-10 text-gray-500">
                  Không có dữ liệu.
                </td>
              </tr>
            ) : (
              filteredFines.map((fine) => (
                <tr key={fine.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{fine.id}</td>
                  <td className="py-3 px-4">{fine.borrow?.id}</td>
                  <td className="py-3 px-4">
                    {fine.amount.toLocaleString("vi-VN")} ₫
                  </td>
                  <td className="py-3 px-4 truncate max-w-xs">{fine.reason}</td>
                  <td className="py-3 px-4">
                    {moment(fine.issueDate).format("DD/MM/YYYY")}
                  </td>
                  <td className="py-3 px-4">
                    {fine.paidDate
                      ? moment(fine.paidDate).format("DD/MM/YYYY")
                      : "—"}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <StatusBadge status={fine.status} />
                  </td>
                  <td className="py-3 px-4 text-center">
                    {renderTopActionButtons(fine)}
                    {renderBottomActionButtons(fine)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
};

export default Fines;
