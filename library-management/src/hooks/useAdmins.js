import { useState, useEffect, useCallback } from "react";
import { authApis, endpoints } from "../configs/API";

const useAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lấy danh sách Admin
  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      let res = await authApis().get(endpoints["admins"]);
      setAdmins(res.data);
      console.log(res.data)
      setError(null);
    } catch (err) {
      console.error("Lỗi khi tải Admins:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Lấy admin theo ID
  const fetchAdminById = useCallback(async (id) => {
    try {
      let res = await authApis().get(endpoints["admin-detail"](id));
      return res.data;
    } catch (err) {
      console.error(`Lỗi khi tải admin id=${id}:`, err);
      throw err;
    }
  }, []);

  // Thêm hoặc cập nhật Admin
  const addAdmin = useCallback(async (adminData) => {
    try {
      let res = await authApis().post(endpoints["admin-add"], adminData);
      fetchAdmins(); // refresh
      return res.data;
    } catch (err) {
      console.error("Lỗi khi lưu admin:", err);
      throw err;
    }
  }, [fetchAdmins]);

  const updateAdmin = useCallback(async (adminData) => {
    try {
      let res = await authApis().patch(endpoints["admin-update"], adminData);
      fetchAdmins(); 
      return res.data;
    } catch (err) {
      console.error("Lỗi khi lưu admin:", err);
      throw err;
    }
  }, [fetchAdmins]);
//     const updateAdmin = async (member) => {
//     setLoading(true);
//     try {
      
//       const res = await authApis().patch(
//         endpoints["update-profile"](member.get("id")),
//         member
//       );
//       return res.data;
//     } catch (err) {
//       console.error("Lỗi khi cập nhật thành viên:", err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

  const deleteAdmin = useCallback(async (id) => {
    try {
      await authApis().delete(endpoints["admin-delete"](id));
      fetchAdmins();
    } catch (err) {
      console.error(`Lỗi khi xóa admin id=${id}:`, err);
      throw err;
    }
  }, [fetchAdmins]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  return { admins, loading, error, fetchAdmins, fetchAdminById, addAdmin, updateAdmin,deleteAdmin };
};

export default useAdmins;
