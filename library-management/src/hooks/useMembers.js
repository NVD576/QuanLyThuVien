import { useEffect, useState, useCallback } from "react";
import { authApis, endpoints } from "../configs/API";

const useMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [keyword, setKeyword] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await authApis().get(endpoints.members, {
        params: { page, size, keyword },
      });

      if (res.data) {
        setMembers(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setTotalElements(res.data.totalElements || 0);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách thành viên:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [page, size, keyword]);
  

  const detailReader = async (id) => {
    try {
      const res = await authApis().get(endpoints["member-detail"](id));
      return res.data;
    } catch (err) {
      console.error("Lỗi lấy user:", err);
      return null;
    }
  };
  const addMember = useCallback(async (user) => {
    setLoading(true);
    try {
      const res = await authApis().post(endpoints["member-add"], user);
      return res.data;
    } catch (err) {
      console.error("Lỗi khi thêm thành viên:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMember = async (member) => {
    setLoading(true);
    try {
      const res = await authApis().patch(
        endpoints["member-update"],
        member
      );
      return res.data;
    } catch (err) {
      console.error("Lỗi khi cập nhật thành viên:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteMember = useCallback(async (id) => {
    try {
      await authApis().delete(endpoints["user-delete"](id));
    } catch (err) {
      console.error("Lỗi khi xóa thành viên:", err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchMembers({ page: 0, size: 10 });
  }, [fetchMembers]);

  return {
    members,
    loading,
    error,
    page,
    setPage,
    size,
    setSize,
    keyword,
    setKeyword,
    totalPages,
    totalElements,
    setTotalPages,
    setTotalElements,
    fetchMembers,
    detailReader,
    addMember,
    updateMember,
    deleteMember,
  };
};

export default useMembers;
