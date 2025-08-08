import { useEffect, useState, useCallback } from "react";
import { authApis, endpoints } from "../configs/API";

const useMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await authApis().get(endpoints.members);
      setMembers(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách thành viên:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

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
        endpoints["update-profile"](member.get("id")),
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
    fetchMembers();
  }, [fetchMembers]);

  return {
    members,
    loading,
    error,
    fetchMembers,
    addMember,
    updateMember,
    deleteMember,
  };
};

export default useMembers;
