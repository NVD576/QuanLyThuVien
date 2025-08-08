import { useEffect, useState } from "react";
import { authApis, endpoints } from "../configs/API";

const useBorrows = () => {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  // Lấy tất cả phiếu mượn
  // const fetchBorrows = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await authApis().get(endpoints["borrows"]);
  //     console.log("Fetched borrows:", res.data);
  //     setBorrows(res.data);
  //   } catch (err) {
  //     console.error("Lỗi khi lấy danh sách mượn:", err);
  //     setError(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchBorrows = async (keyword, page) => {
    try {
      setLoading(true);
      const res = await authApis().get(endpoints["borrow-search"], {
        params: { keyword, page, size: 5 },
      });
      setBorrows(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching borrows:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    fetchBorrows(keyword,page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ page]);

  // Lấy mượn theo userId
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

  // Thêm mượn
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

  // Cập nhật
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

  // Xoá
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
    fetchBorrows,
    fetchBorrowsByUser,
    addBorrow,
    updateBorrow,
    deleteBorrow,
    totalPages,
    keyword,
    page,
    setKeyword,
    setPage
  };
};

export default useBorrows;
