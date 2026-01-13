import { useState, useEffect, useCallback } from "react";
import { authApis, endpoints } from "../configs/API";

const useLibrarians = () => {
  const [librarians, setLibrarians] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);

 

  const fetchLibrarians = useCallback(
    async (keywordParam = keyword, pageParam = page) => {
      try {
        setLoading(true);
        let params = { keyword, page, size: 5 };

        const res = await authApis().get(endpoints["librarians"], { params });
        setLibrarians(res.data.content);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Error fetching librarians:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [keyword, page]
  );

  useEffect(() => {
    fetchLibrarians(keyword, page);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchLibrarians]);


  const fetchLibrariansById = useCallback(async (id) => {
    setLoading(true);
    try {
      let res = await authApis().get(endpoints["librarian-detail"](id));
      return res.data;
    } catch (err) {
      console.error(`Lỗi khi tải Librarians id=${id}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addLibrarians = async (LibrariansData) => {
    setLoading(true);
    try {
      let res = await authApis().post(
        endpoints["librarian-add"],
        LibrariansData
      );
      fetchLibrarians(); 
      return res.data;
    } catch (err) {
      console.error("Lỗi khi lưu Librarians:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLibrarians = async (LibrariansData) => {
    setLoading(true);
    try {
      let res = await authApis().patch(
        endpoints["librarian-update"],
        LibrariansData
      );
      return res.data;
    } catch (err) {
      console.error("Lỗi khi lưu Librarians:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteLibrarians = useCallback(
    async (id) => {
      try {
        await authApis().delete(endpoints["librarian-delete"](id));
        fetchLibrarians();
      } catch (err) {
        console.error(`Lỗi khi xóa Librarians id=${id}:`, err);
        throw err;
      }
    },
    [fetchLibrarians]
  );

  return {
    librarians,
    page,
    totalPages,
    setKeyword,
    setPage,
    loading,
    error,
    fetchLibrarians,
    fetchLibrariansById,
    addLibrarians,
    updateLibrarians,
    deleteLibrarians,
  };
};

export default useLibrarians;
