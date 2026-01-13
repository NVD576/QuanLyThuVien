import React, { useState } from "react";
import useCategories from "../hooks/useCategories";
import { Pencil, Trash2, PlusCircle, XCircle, Folder } from "lucide-react";
import {  toast } from "react-hot-toast";
import LoadingSpinner from "../components/layouts/LoadingSpinner"; 

const Categories = () => {
  const [form, setForm] = useState({ id: null, name: "", description: "" });
  const [showForm, setShowForm] = useState(false);

  const {
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    categories,
    loading, // Assuming your hook provides a loading state
  } = useCategories();

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Tên danh mục không được để trống.");
      return;
    }

    const isEditing = !!form.id;
    const action = isEditing ? updateCategory(form) : addCategory(form);

    const promise = action.then(() => {
      fetchCategories();
      handleCancel();
    });

    toast.promise(promise, {
      loading: isEditing ? 'Đang cập nhật...' : 'Đang thêm mới...',
      success: isEditing ? 'Cập nhật thành công!' : 'Thêm danh mục thành công!',
      error: 'Có lỗi xảy ra!',
    });
  };

  const handleEdit = (category) => {
    setForm({
      id: category.id,
      name: category.name,
      description: category.description,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa danh mục này không? Các sách liên quan cũng có thể bị ảnh hưởng.")) {
      const promise = deleteCategory(id).then(() => fetchCategories());
      toast.promise(promise, {
        loading: 'Đang xóa...',
        success: 'Xóa thành công!',
        error: 'Xóa thất bại.',
      });
    }
  };

  const handleCancel = () => {
    setForm({ id: null, name: "", description: "" });
    setShowForm(false);
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-full">
  
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Quản lý Danh mục
            </h2>
            <button
                onClick={() => {
                    setShowForm(true);
                    setForm({ id: null, name: "", description: "" });
                }}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition"
            >
                <PlusCircle size={18} />
                Thêm Danh mục
            </button>
        </div>

        {showForm && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex justify-center items-center z-50 animate-fade-in">
                <div className="bg-white shadow-2xl p-6 rounded-lg w-full max-w-md relative">
                    <button
                        onClick={handleCancel}
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
                    >
                        <XCircle size={24} />
                    </button>
                    <form onSubmit={handleSubmit}>
                        <h3 className="text-xl font-bold mb-6 text-gray-800">
                            {form.id ? "Chỉnh sửa Danh mục" : "Thêm Danh mục mới"}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block font-semibold text-gray-700 mb-1">
                                    Tên danh mục
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-gray-700 mb-1">
                                    Mô tả
                                </label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full border border-gray-300 px-4 py-2 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex gap-4 justify-end">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
                            >
                                {form.id ? "Lưu thay đổi" : "Thêm mới"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {loading ? <LoadingSpinner /> : (
            categories.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="bg-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all rounded-lg flex flex-col group"
                        >
                            <div className="p-5 flex-grow">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                                        <Folder size={24} />
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition">
                                        {category.name}
                                    </h4>
                                </div>
                                <p className="text-gray-600 text-sm mt-3 min-h-[40px]">{category.description}</p>
                            </div>
                            <div className="mt-2 flex justify-end gap-2 border-t bg-gray-50 p-3 rounded-b-lg">
                                <button
                                    onClick={() => handleEdit(category)}
                                    className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-100 transition"
                                    title="Sửa"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-100 transition"
                                    title="Xóa"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-700">Chưa có danh mục nào</h3>
                    <p className="text-gray-500 mt-2">Hãy bắt đầu bằng cách thêm một danh mục mới.</p>
                </div>
            )
        )}
    </div>
  );
};

export default Categories;
