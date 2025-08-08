import { useEffect, useState, useCallback } from "react";
import { authApis, endpoints } from "../configs/API";

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApis().get(endpoints["categories"]);
      setCategories(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addCategory = useCallback(async (category) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApis().post(endpoints["category-add"], category);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

    const updateCategory = useCallback(async (category) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Dữ liệu gửi đi:", category);

      const res = await authApis().patch(endpoints["category-update"], category);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);


  const deleteCategory = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const url = `${endpoints["categories"]}/${id}/delete`;
      await authApis().delete(url);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    setCategories,
    loading,
    error,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
};

export default useCategories;
