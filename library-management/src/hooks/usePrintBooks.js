// src/hooks/usePrintBooks.js
import { useState, useEffect, useCallback } from "react";
import { authApis, endpoints } from "../configs/API";

const usePrintBooks = () => {
  const [printBooks, setPrintBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lấy toàn bộ printBooks
  const fetchPrintBooks = useCallback(async () => {
    setLoading(true);
    try {
      let res = await authApis().get(endpoints["printBooks"]);
      setPrintBooks(res.data);
      setError(null);
    } catch (err) {
      console.error("Lỗi khi tải printBooks:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Lấy 1 printBook theo id
  const fetchPrintBookById = useCallback(async (id) => {
    try {
      let res = await authApis().get(endpoints["printBook-id"](id));
      
      
      return res.data;
    } catch (err) {
      console.error(`Lỗi khi tải printBook id=${id}:`, err);
      throw err;
    }
  }, []);

  // Lấy printBook theo bookId
  const fetchPrintBooksByBookId = useCallback(async (bookId) => {
    if(bookId ==="") return null
    try {
      let res = await authApis().get(endpoints["printBook-bookid"](bookId));
      setPrintBooks(res.data)
      console.log(res.data)
      return res.data;
    } catch (err) {
      console.error(`Lỗi khi tải printBooks của bookId=${bookId}:`, err);
      throw err;
    }
  }, []);

  // Thêm mới printBook
  const addPrintBook = useCallback(async (data) => {
    try {
      let res = await authApis().post(endpoints["printBook-add"], data);
      await fetchPrintBooks(); // load lại danh sách
      return res.data;
    } catch (err) {
      console.error("Lỗi khi thêm printBook:", err);
      throw err;
    }
  }, [fetchPrintBooks]);

  // Cập nhật printBook
  const updatePrintBook = useCallback(async (data) => {
    try {
      let res = await authApis().patch(endpoints["printBook-update"], data);
      await fetchPrintBooks();
      return res.data;
    } catch (err) {
      console.error("Lỗi khi cập nhật printBook:", err);
      throw err;
    }
  }, [fetchPrintBooks]);

  // Xóa printBook
  const deletePrintBook = useCallback(async (id) => {
    try {
      await authApis().delete(endpoints["printBook-delete"](id));
      await fetchPrintBooks();
    } catch (err) {
      console.error(`Lỗi khi xóa printBook id=${id}:`, err);
      throw err;
    }
  }, [fetchPrintBooks]);

  // Load lần đầu
  useEffect(() => {
    fetchPrintBooks();
  }, [fetchPrintBooks]);

  return {
    printBooks,
    loading,
    error,
    fetchPrintBooks,
    fetchPrintBookById,
    fetchPrintBooksByBookId,
    addPrintBook,
    updatePrintBook,
    deletePrintBook,
  };
};

export default usePrintBooks;
