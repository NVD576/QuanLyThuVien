import { useEffect, useState } from "react";
import { authApis, endpoints } from "../configs/API";

const useBorrows = () => {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState("");

  const fetchBorrows = async (keyword, page) => {
    try {
      setLoading(true);
      const params = { keyword, page, size: 8 };
      if (status) params.status = status;
      const res = await authApis().get(endpoints["borrow-search"], { params });
      setBorrows(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching borrows:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBorrows(keyword, page, status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page,status]);

  const fetchBorrowsByUser = async (userId) => {
    setLoading(true);
    try {
      const res = await authApis().get(endpoints["borrow-user"](userId));
      setBorrows(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy mượn theo user:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const addBorrow = async (data) => {
    try {
      setLoading(true);
      const res = await authApis().post(endpoints["borrow-add"], data);
      await fetchBorrows();
      return res.data;
    } catch (err) {
      console.error("Lỗi khi thêm mượn:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const updateBorrow = async (data) => {
    try {
      setLoading(true);
      const res = await authApis().patch(endpoints["borrow-update"], data);
      await fetchBorrows();
      return res.data;
    } catch (err) {
      console.error("Lỗi khi cập nhật mượn:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteBorrow = async (id) => {
    try {
      setLoading(true);
      const res = await authApis().delete(endpoints["borrow-delete"](id));
      await fetchBorrows();
      return res.data;
    } catch (err) {
      console.error("Lỗi khi xoá mượn:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    borrows,
    loading,
    error,
    status,
    fetchBorrows,
    fetchBorrowsByUser,
    addBorrow,
    updateBorrow,
    deleteBorrow,
    totalPages,
    keyword,
    page,
    setKeyword,
    setPage,
    setStatus,
  };
};

export default useBorrows;
