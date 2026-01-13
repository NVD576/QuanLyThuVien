import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { authApis, endpoints } from "../configs/API";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiDollarSign,
  FiMail,
  FiMapPin,
  FiPhone,
  FiClock,
  FiAlertTriangle,
  FiBook,
  FiX,
} from "react-icons/fi";
import moment from "moment";
import LoadingSpinner from "../components/layouts/LoadingSpinner";
import BorrowFormModal from "../components/BorrowFormModal";

const UserDetail = () => {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [currentBorrows, setCurrentBorrows] = useState([]);
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("currentBorrows");
  const [fineFilter, setFineFilter] = useState("All");
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const pendingFinesCount = fines.filter((f) => f.status === "Pending").length;
  const [selectedFine, setSelectedFine] = useState(null);
  const [payMethod, setPayMethod] = useState("Cash");
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isWaiveModalOpen, setIsWaiveModalOpen] = useState(false);
  const [waiveReason, setWaiveReason] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);

      const resMember = await authApis().get(endpoints["member-detail"](id));

      setMember(resMember.data);

      const resBorrows = await authApis().get(endpoints["borrow-user"](id));
      const allBorrows = resBorrows.data;
      setCurrentBorrows(
        allBorrows.filter(
          (b) => b.status === "Borrowed" || b.status === "Pending"
        )
      );

      const history = allBorrows
        .filter((b) => ["Returned", "Overdue"].includes(b.status))
        .sort((a, b) => {
          const dateA = moment(a.returnDate || a.dueDate);
          const dateB = moment(b.returnDate || b.dueDate);
          return dateB - dateA;
        });
      setBorrowHistory(history);

      const resFines = await authApis().get(endpoints["fine-user"](id));
      const sortedFines = resFines.data.sort((a, b) => {
        const dateA = moment(a.issueDate);
        const dateB = moment(b.issueDate);
        return dateB - dateA;
      });
      setFines(sortedFines);

      return sortedFines;
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const filteredFines = fines.filter((fine) => {
    if (fineFilter === "All") return true;
    return fine.status === fineFilter;
  });

  const handleWaiveFine = async (fineId, reason) => {
    try {
      const fine = fines.find((f) => f.id === fineId);
      const data = {
        id: fineId,
        amount: 0,
        status: "Waived",
        reason: reason,
        issueDate: fine.issueDate,
        paidDate: moment().format("YYYY-MM-DD"),
      };
      await authApis().patch(endpoints["fine-update"], data);
      toast.success("Đã miễn phạt thành công");
      await fetchData();
    } catch (err) {
      console.error("Lỗi khi miễn phạt:", err);
      toast.error("Miễn phạt thất bại");
    }
  };

  const openWaiveModal = (fine) => {
    setSelectedFine(fine);
    setWaiveReason("");
    setIsWaiveModalOpen(true);
  };

  const confirmWaiveFine = async () => {
    if (!selectedFine || !waiveReason.trim()) {
      toast.error("Vui lòng nhập lý do miễn phạt");
      return;
    }

    await handleWaiveFine(selectedFine.id, waiveReason.trim());
    setIsWaiveModalOpen(false);
    setSelectedFine(null);
    setWaiveReason("");
  };

  const handleApproveBorrow = async (borrowId) => {
    if (!window.confirm("Bạn có chắc muốn duyệt yêu cầu mượn sách này?"))
      return;
    try {
      const borrow = currentBorrows.find((b) => b.id === borrowId);
      if (!borrow) {
        toast.error("Không tìm thấy thông tin mượn sách.");
        return;
      }

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
      toast.success("Đã duyệt yêu cầu mượn sách thành công");
      await fetchData();
    } catch (err) {
      console.error("Lỗi khi duyệt mượn sách:", err);
      toast.error("Duyệt mượn sách thất bại, vui lòng thử lại.");
    }
  };

  const handleRejectBorrow = async (borrowId) => {
    if (!window.confirm("Bạn có chắc muốn từ chối yêu cầu mượn sách này?"))
      return;
    try {
      const borrow = currentBorrows.find((b) => b.id === borrowId);
      if (!borrow) {
        toast.error("Không tìm thấy thông tin mượn sách.");
        return;
      }

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
      toast.success("Đã từ chối yêu cầu mượn sách thành công");
      await fetchData();
    } catch (err) {
      console.error("Lỗi khi từ chối mượn sách:", err);
      toast.error("Từ chối mượn sách thất bại, vui lòng thử lại.");
    }
  };

  const handlePayFine = (fine) => {
    setSelectedFine(fine);
    setPayMethod("Cash");
    setIsPayModalOpen(true);
  };

  const confirmPayFine = async () => {
    if (!selectedFine) return;
    try {
      const data = {
        id: selectedFine.id,
        amount: selectedFine.amount,
        status: "Paid",
        reason: selectedFine.reason,
        issueDate: selectedFine.issueDate,
        paidDate: new Date().toISOString(),
        payMethod: payMethod,
      };

      if (payMethod === "Cash") {
        const res = await authApis().patch(endpoints["fine-update"], data);
        if (res.status === 200) toast.success("Thanh toán thành công");
      } else {
        const result = await processPayment1(data);
        console.log(result);
        // processVnPayPayment phải trả về object { success: true/false }
        if (result.success) {
          toast.success("Thanh toán thành công");
        } else {
          toast.error("Thanh toán thất bại");
        }
      }

      await fetchData();
      setIsPayModalOpen(false);
      setSelectedFine(null);
    } catch (err) {
      console.error("Lỗi khi thanh toán phạt:", err);
      // toast.error("Thanh toán thất bại, vui lòng thử lại.");
    }
  };
  const processPayment1 = async (data) => {
    try {
      const res = await authApis().get(endpoints["payment-create"], {
        params: {
          fineId: data.id,
          amount: data.amount,
          type: "Fine",
          reason: data.reason,
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
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleReturnBook = async (borrowId) => {
    if (!window.confirm("Bạn có chắc muốn trả sách này?")) return;
    try {
      const borrow = currentBorrows.find((b) => b.id === borrowId);
      if (!borrow) {
        toast.error("Không tìm thấy thông tin mượn sách.");
        return;
      }

      const now = new Date();
      const dueDate = new Date(borrow.dueDate);

      const status = now <= dueDate ? "Returned" : "Overdue";

      const payload = {
        id: borrow.id,
        userId: borrow.userId,
        printBookId: borrow.printBookId,
        borrowDate: borrow.borrowDate,
        dueDate: borrow.dueDate,
        returnDate: new Date().toISOString(),
        status: status,
      };
      await authApis().patch(endpoints["borrow-update"], payload);
      const updatedFines = await fetchData();
      if (updatedFines.some((fine) => fine.status === "Pending")) {
        toast.error(
          "Có phạt chưa thanh toán. Vui lòng kiểm tra danh sách phạt."
        );
      }
    } catch (err) {
      console.error("Lỗi khi trả sách:", err);
      toast.error("Trả sách thất bại, vui lòng thử lại.");
    } finally {
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!member)
    return (
      <div className="p-6 text-center text-gray-500">
        Không tìm thấy người dùng.
      </div>
    );

  const StatusBadge = ({ status, type }) => {
    const styles = {
      borrow: {
        Borrowed: "bg-blue-100 text-blue-800 ring-1 ring-blue-200",
        Returned: "bg-green-100 text-green-800 ring-1 ring-green-200",
        Overdue: "bg-red-100 text-red-800 ring-1 ring-red-200",
        Pending: "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200",
        Cancelled: "bg-gray-100 text-gray-800 ring-1 ring-gray-200",
      },
      fine: {
        Paid: "bg-green-100 text-green-800 ring-1 ring-green-200",
        Pending: "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200",
        Waived: "bg-blue-100 text-blue-800 ring-1 ring-blue-200",
      },
    };
    return (
      <span
        className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
          styles[type]?.[status] ??
          "bg-gray-100 text-gray-800 ring-1 ring-gray-200"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className=" p-6 bg-gray-50 h-full overflow-y-auto">
      
      <div className="mb-6">
        <Link
          to="/users/readers"
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold transition-colors duration-200"
        >
          <FiArrowLeft size={20} /> Quay lại danh sách
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-2xl rounded-3xl p-8 mb-8 ring-1 ring-gray-200/50 "
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative flex-shrink-0"
          >
            <img
              src={member.user.avatar}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-white ring-4 ring-indigo-400 shadow-lg"
            />
            <div className="absolute bottom-1 right-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full px-3 py-1 shadow-md">
              <span className="text-white text-xs font-bold tracking-wider uppercase">
                {member.membershipLevel}
              </span>
            </div>
          </motion.div>

          <div className="flex-1 text-center md:text-left">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent"
            >
              {member.user.firstName} {member.user.lastName}
            </motion.h2>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold text-gray-800 border-b-2 border-indigo-200 pb-2">
                  Thông tin liên hệ
                </h3>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-gray-700">
                    <FiMail className="text-indigo-500 text-lg flex-shrink-0" />
                    <span className="text-gray-800 font-medium break-all">
                      {member.user.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <FiPhone className="text-indigo-500 text-lg flex-shrink-0" />
                    <span className="text-gray-800 font-medium">
                      {member.user.phone || "Chưa cập nhật"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <FiMapPin className="text-indigo-500 text-lg flex-shrink-0" />
                    <span className="text-gray-800 font-medium">
                      {member.user.address || "Chưa cập nhật"}
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold text-gray-800 border-b-2 border-indigo-200 pb-2">
                  Tình trạng tài khoản
                </h3>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    <FiCheckCircle
                      className={`text-lg ${
                        member.user.isActive ? "text-green-500" : "text-red-500"
                      }`}
                    />
                    <span
                      className={`text-sm font-semibold px-3 py-1 rounded-full ${
                        member.user.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {member.user.isActive ? "Đang hoạt động" : "Tạm ngưng"}
                    </span>
                  </div>

                  <div
                    className={`flex items-start gap-3 p-3 rounded-lg border ${
                      pendingFinesCount > 0
                        ? "bg-yellow-50 border-yellow-300 text-yellow-800"
                        : "bg-green-50 border-green-300 text-green-800"
                    }`}
                  >
                    <FiAlertTriangle className="text-xl flex-shrink-0 mt-0.5" />
                    <span className="font-medium">
                      {pendingFinesCount > 0
                        ? `Có ${pendingFinesCount} khoản phạt chưa thanh toán.`
                        : "Không có khoản phạt nào."}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden ring-1 ring-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {[
              {
                tabName: "currentBorrows",
                label: "Sách đang mượn",
                icon: <FiBook className="mr-2" />,
                count: currentBorrows.length,
              },
              {
                tabName: "borrowHistory",
                label: "Lịch sử mượn",
                icon: <FiClock className="mr-2" />,
                count: borrowHistory.length,
              },
              {
                tabName: "fines",
                label: "Khoản phạt",
                icon: <FiDollarSign className="mr-2" />,
                count: fines.filter((f) => f.status === "Pending").length,
                badgeColor: "red",
              },
            ].map(({ tabName, label, icon, count, badgeColor }) => (
              <button
                key={tabName}
                onClick={() => setActiveTab(tabName)}
                className={`flex items-center py-4 px-6 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === tabName
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {icon}
                {label}
                {count > 0 && (
                  <span
                    className={`ml-2 py-0.5 px-2 rounded-full text-xs font-semibold ${
                      badgeColor === "red"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "currentBorrows" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Sách đang mượn
                </h3>
                <button
                  onClick={() => setIsBorrowModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
                >
                  + Mượn sách
                </button>
              </div>

              {currentBorrows.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FiBook className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm font-medium">
                    Không có sách nào đang mượn
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Sách
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Ngày mượn
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Hạn trả
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Trạng thái
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentBorrows.map((b) => (
                        <tr
                          key={b.id}
                          className="hover:bg-gray-50 transition duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                            {b.bookTitle}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                            {moment(b.borrowDate).format("DD/MM/YYYY")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                            {moment(b.dueDate).format("DD/MM/YYYY")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={b.status} type="borrow" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {b.status === "Pending" ? (
                              <>
                                <button
                                  onClick={() => handleApproveBorrow(b.id)}
                                  className="text-green-600 hover:text-green-800 font-medium px-3 py-1 bg-green-50 rounded-md"
                                >
                                  Duyệt
                                </button>
                                <button
                                  onClick={() => handleRejectBorrow(b.id)}
                                  className="text-red-600 hover:text-red-800 font-medium px-3 py-1 bg-red-50 rounded-md"
                                >
                                  Từ chối
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleReturnBook(b.id)}
                                className="text-indigo-600 hover:text-indigo-900 font-medium"
                              >
                                Xác nhận trả
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "borrowHistory" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Lịch sử mượn sách
              </h3>

              {borrowHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FiClock className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm font-medium">
                    Chưa có lịch sử mượn sách
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Sách
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Ngày mượn
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Hạn trả
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Ngày trả
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Trạng thái
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {borrowHistory.map((b) => (
                        <tr
                          key={b.id}
                          className="hover:bg-gray-50 transition duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                            {b.bookTitle}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                            {moment(b.borrowDate).format("DD/MM/YYYY")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                            {moment(b.dueDate).format("DD/MM/YYYY")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                            {b.returnDate
                              ? moment(b.returnDate).format("DD/MM/YYYY")
                              : "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={b.status} type="borrow" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "fines" && (
            <div className="space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Khoản phạt
                </h3>

                <div className="flex items-center gap-4">
                  <select
                    value={fineFilter}
                    onChange={(e) => setFineFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 max-w-xs"
                  >
                    <option value="All">Tất cả ({fines.length})</option>
                    <option value="Pending">
                      Chưa thanh toán (
                      {fines.filter((f) => f.status === "Pending").length})
                    </option>
                    <option value="Paid">
                      Đã thanh toán (
                      {fines.filter((f) => f.status === "Paid").length})
                    </option>
                    <option value="Waived">
                      Miễn phạt (
                      {fines.filter((f) => f.status === "Waived").length})
                    </option>
                  </select>

                  <div className="text-sm">
                    <span className="text-gray-600">Tổng phạt: </span>
                    <span className="font-semibold">
                      {fines
                        .filter((fine) => fine.status === "Pending")
                        .reduce((sum, fine) => sum + fine.amount, 0)
                        .toLocaleString("vi-VN")}{" "}
                      ₫
                    </span>
                  </div>
                </div>
              </div>

              {filteredFines.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FiCheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm font-medium">
                    {fineFilter === "Pending"
                      ? "Không có khoản phạt nào chưa thanh toán"
                      : "Không có khoản phạt nào"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Sách
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Lý do
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Ngày phạt
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Số tiền
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Trạng thái
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredFines
                        .sort((a, b) => b.id - a.id)
                        .map((fine) => (
                          <tr
                            key={fine.id}
                            className="hover:bg-gray-50 transition duration-150"
                          >
                            <td
                              className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 max-w-xs truncate"
                              title={fine.borrow?.printBook?.book?.title}
                            >
                              {fine.borrow?.printBook?.book?.title || "N/A"}
                            </td>
                            <td
                              className="px-6 py-4 text-gray-500 max-w-md truncate"
                              title={fine.reason}
                            >
                              {fine.reason}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                              {fine.issueDate
                                ? moment(fine.issueDate).format("DD/MM/YYYY")
                                : "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-gray-900">
                              {fine.amount.toLocaleString("vi-VN")} ₫
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <StatusBadge status={fine.status} type="fine" />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                              {fine.status === "Pending" && (
                                <>
                                  <button
                                    onClick={() => handlePayFine(fine)}
                                    className="text-indigo-600 hover:text-indigo-900 font-medium"
                                  >
                                    Thanh toán
                                  </button>
                                  <button
                                    onClick={() => openWaiveModal(fine)}
                                    className="text-green-600 hover:text-green-900 font-medium"
                                  >
                                    Miễn phạt
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <BorrowFormModal
        isOpen={isBorrowModalOpen}
        onClose={() => setIsBorrowModalOpen(false)}
        onSubmit={async (data) => {
          try {
            await authApis().post(endpoints["borrow-add"], data);
            toast.success("Mượn sách thành công");
            await fetchData();
            setIsBorrowModalOpen(false);
          } catch (err) {
            console.error(err);
            toast.error("Mượn sách thất bại \n" + err.response.data);
          }
        }}
        allReaders={[member]}
      />

      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-bold mb-4">
              Chọn phương thức thanh toán
            </h2>

            <select
              value={payMethod}
              onChange={(e) => setPayMethod(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-6 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Cash">Tiền mặt</option>
              <option value="BankTransfer">Chuyển khoản</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={confirmPayFine}
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {isWaiveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Miễn phạt</h2>
              <button
                onClick={() => setIsWaiveModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Số tiền phạt:{" "}
                <span className="font-semibold">
                  {selectedFine?.amount.toLocaleString("vi-VN")} ₫
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Sách:{" "}
                <span className="font-semibold">
                  {selectedFine?.borrow?.printBook?.book?.title || "N/A"}
                </span>
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do miễn phạt *
              </label>
              <textarea
                value={waiveReason}
                onChange={(e) => setWaiveReason(e.target.value)}
                placeholder="Nhập lý do miễn phạt..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsWaiveModalOpen(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={confirmWaiveFine}
                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
                disabled={!waiveReason.trim()}
              >
                Xác nhận miễn phạt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetail;
