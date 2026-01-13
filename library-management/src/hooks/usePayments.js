import { useState } from "react";
import { authApis, endpoints } from "../configs/API";
import toast from "react-hot-toast";

const usePayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

const loadPayments = async (params = {}) => {
    setLoading(true);
    try {
      const { 
        page = 0, 
        size = 10, 
        userId, 
        userName, 
        startDate, 
        endDate, 
        search 
      } = params;

      const queryParams = {
        page,
        size,
        ...(userId && { userId }),
        ...(userName && { userName }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(search && { search })
      };

      const res = await authApis().get(endpoints.payments, { params: queryParams });
      setPayments(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setPage(page);
    } catch (error) {
      console.error("Lỗi tải danh sách thanh toán:", error);
    } finally {
      setLoading(false);
    }
  };
  const createPayment = async (formData) => {
    try {
      await authApis().post(endpoints["payment-add"], formData);
      toast.success("Thêm payment thành công");
      loadPayments();
    } catch (err) {
      toast.error("Lỗi khi thêm payment");
    }
  };

  const updatePayment = async (id, formData) => {
    try {
        console.log(formData)
      await authApis().patch(`${endpoints["payment-update"]}`, formData);
      toast.success("Cập nhật payment thành công");
      loadPayments();
    } catch (err) {
      toast.error("Lỗi khi cập nhật payment");
    }
  };

  const deletePayment = async (id) => {
    
    try {
      await authApis().delete(endpoints["payment-delete"](id));
      toast.success("Xóa payment thành công");
      loadPayments();
    } catch (err) {
      toast.error("Lỗi khi xóa payment");
    }
  };

  return {
    payments,
    loading,
    page,
    setPage,
    totalPages,
    loadPayments,
    createPayment,
    updatePayment,
    deletePayment,
  };
};

export default usePayments;
