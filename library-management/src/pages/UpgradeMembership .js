import React, { useEffect, useState } from "react";
import { authApis, endpoints } from "../configs/API";
import { toast } from "react-hot-toast";
import Pagination from "../components/layouts/Pagination";
import {
  FiSearch,
  FiUsers,
  FiAward,
  FiCreditCard,
  FiArrowUp,
  FiUser,
  FiMail,
  FiStar,
} from "react-icons/fi";

const membershipLevels = [
  {
    value: "Basic",
    label: "Basic",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
  },
  {
    value: "Premium",
    label: "Premium",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
];

const paymentMethods = [
  { value: "Cash", label: "Tiền mặt", icon: "💵" },
  { value: "BankTransfer", label: "Chuyển khoản ngân hàng", icon: "🏦" },
];

const UpgradeModal = ({ member, onClose, onUpgrade }) => {
  const [newLevel, setNewLevel] = useState(member?.membershipLevel || "");
  const [payMethod, setPayMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = async () => {
    if (!newLevel) {
      toast.error("Vui lòng chọn hạng mới");
      return;
    }
    if (newLevel === member.membershipLevel) {
      toast.error("Hạng mới phải khác hạng hiện tại");
      return;
    }

    if (newLevel === "Premium") {
      if (!payMethod) {
        toast.error("Vui lòng chọn phương thức thanh toán");
        return;
      }
      setShowConfirmation(true);
      return;
    }
  };

  const processPayment1 = async () => {
    try {
      const res = await authApis().get(endpoints["payment-create"], {
        params: {
          userId: member.id,
          amount: 50000,
          type: "Membership",
          reason: "Nâng cấp từ Basic lên Premium",
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

  const performUpgrade = async () => {
    setLoading(true);
    try {
      if (payMethod === "BankTransfer") {
        await processPayment1();
      } else {
        await onUpgrade(member.id, newLevel, payMethod);
        toast.success("Nâng hạng thành công");
        onClose();
      }
    } catch {
      toast.error("Nâng hạng thất bại");
    } finally {
      setLoading(false);
      setShowConfirmation(false);
    }
  };

  const MembershipBadge = ({ level }) => {
    const levelInfo = membershipLevels.find((l) => l.value === level);
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${levelInfo?.bgColor} ${levelInfo?.color}`}
      >
        {levelInfo?.label}
      </span>
    );
  };

  if (showConfirmation) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiStar className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Xác nhận nâng hạng
            </h2>
            <p className="text-gray-600 mb-6">
              Bạn sắp nâng hạng thành viên lên Premium
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-yellow-800">
                Phí nâng hạng:
              </span>
              <span className="text-lg font-bold text-yellow-700">
                50,000 VND
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-yellow-800">
                Phương thức thanh toán:
              </span>
              <span className="font-semibold text-yellow-700">
                {paymentMethods.find((p) => p.value === payMethod)?.label}
              </span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <FiUser className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-semibold text-blue-800">
                  {member.user?.firstName} {member.user?.lastName}
                </p>
                <p className="text-sm text-blue-600">{member.user?.email}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowConfirmation(false)}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={loading}
            >
              Quay lại
            </button>
            <button
              onClick={performUpgrade}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-colors font-medium shadow-md"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang xử lý...
                </span>
              ) : (
                "Xác nhận thanh toán"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <FiArrowUp className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Nâng hạng thành viên
            </h2>
            <p className="text-sm text-gray-600">
              Nâng cấp hạng thành viên để hưởng thêm quyền lợi
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <FiUser className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-semibold text-gray-800">
                  {member.user?.firstName} {member.user?.lastName}
                </p>
                <p className="text-sm text-gray-600">{member.user?.email}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Hạng hiện tại:</span>
              <MembershipBadge level={member.membershipLevel} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Chọn hạng mới
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={newLevel}
              onChange={(e) => setNewLevel(e.target.value)}
            >
              <option value="">-- Chọn hạng --</option>
              {membershipLevels.map((lvl) => (
                <option key={lvl.value} value={lvl.value}>
                  {lvl.label}
                </option>
              ))}
            </select>
          </div>

          {newLevel === "Premium" && (
            <div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <FiStar className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-semibold text-yellow-800">
                    Thông tin Premium
                  </span>
                </div>
                <p className="text-sm text-yellow-700">
                  Nâng hạng lên Premium sẽ có phí 50,000 VND. Thành viên Premium
                  được hưởng nhiều ưu đãi đặc biệt.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phương thức thanh toán
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  required
                >
                  <option value="">-- Chọn phương thức thanh toán --</option>
                  {paymentMethods.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.icon} {method.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            disabled={loading}
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors font-medium shadow-md"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang xử lý...
              </span>
            ) : (
              "Nâng hạng"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const MembersUpgrade = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [keyword, setKeyword] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const res = await authApis().get(endpoints.members, {
        params: { page, size, keyword },
      });
      setMembers(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (error) {
      toast.error("Lỗi tải danh sách thành viên");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (memberId, newLevel, payMethod) => {
    const payload = { memberId, newLevel, payMethod };
    await authApis().post(endpoints["member-upgrade"], payload);
    await loadMembers();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(searchTerm);
      setPage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    loadMembers();
  }, [page, size, keyword]);

  const MembershipBadge = ({ level }) => {
    const levelInfo = membershipLevels.find((l) => l.value === level);
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${levelInfo?.bgColor} ${levelInfo?.color}`}
      >
        {levelInfo?.label}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <FiUsers className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            Quản lý Nâng hạng Thành viên
          </h1>
        </div>
        <p className="text-gray-600">
          Quản lý và nâng cấp hạng thành viên thư viện
        </p>
      </div>

      {/* Search and Controls */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tìm kiếm thành viên
            </label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo tên, email, số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Số mục mỗi trang
            </label>
            <select
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value));
                setPage(0);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="5">5 mục</option>
              <option value="10">10 mục</option>
              <option value="20">20 mục</option>
              <option value="50">50 mục</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              Đang tải danh sách thành viên...
            </p>
          </div>
        ) : members.length === 0 ? (
          <div className="py-16 text-center">
            <FiUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">
              Không tìm thấy thành viên nào
            </p>
            <p className="text-gray-400">Hãy thử thay đổi từ khóa tìm kiếm</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Thành viên
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Thông tin liên hệ
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Hạng thành viên
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {members.map((m) => (
                    <tr
                      key={m.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            {m.user?.avatar ? (
                              <img
                                src={m.user.avatar}
                                alt={`${m.user.firstName} ${m.user.lastName}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                  {m.user?.firstName?.[0]}
                                  {m.user?.lastName?.[0]}
                                </span>
                              </div>
                            )}
                          </div>

                          <div>
                            <p className="font-semibold text-gray-800">
                              {m.user?.firstName} {m.user?.lastName}
                            </p>
                            <p className="text-sm text-gray-600">ID: {m.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <FiMail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {m.user?.email}
                            </span>
                          </div>
                          {m.user?.phone && (
                            <div className="flex items-center gap-2">
                              <FiCreditCard className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {m.user.phone}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <MembershipBadge level={m.membershipLevel} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        {m.membershipLevel === "Premium" ? (
                          <button
                            disabled
                            className="inline-flex items-center gap-2 bg-gray-300 text-gray-600 px-4 py-2 rounded-lg cursor-not-allowed"
                          >
                            <FiStar className="w-4 h-4" />
                            Premium
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedMember(m);
                              setModalOpen(true);
                            }}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-colors shadow-sm"
                          >
                            <FiAward className="w-4 h-4" />
                            Nâng hạng
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-gray-200 px-6 py-4">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      {modalOpen && selectedMember && (
        <UpgradeModal
          member={selectedMember}
          onClose={() => setModalOpen(false)}
          onUpgrade={handleUpgrade}
        />
      )}
    </div>
  );
};

export default MembersUpgrade;
