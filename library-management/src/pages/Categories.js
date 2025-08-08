import React, { useState } from "react";
import useCategories from "../hooks/useCategories";
import { Pencil, Trash2, PlusCircle, XCircle } from "lucide-react";

const Categories = () => {
  const [form, setForm] = useState({ id: null, name: "", description: "" });
  const [showForm, setShowForm] = useState(false);

  const {
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    categories,
  } = useCategories();

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    try {
      if (form.id) {
        await updateCategory(form);
      } else {
        await addCategory(form);
      }

      fetchCategories();
      handleCancel();
    } catch (err) {
      console.error("Lỗi khi lưu danh mục:", err);
    }
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
    if (window.confirm("Bạn có chắc muốn xóa danh mục này không?")) {
      await deleteCategory(id);
      fetchCategories();
    }
  };

  const handleCancel = () => {
    setForm({ id: null, name: "", description: "" });
    setShowForm(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-4xl font-extrabold text-indigo-700 mb-8 text-center">
        Quản lý Danh mục
      </h2>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => {
            setShowForm(!showForm);
            setForm({ id: null, name: "", description: "" });
          }}
          className={`flex items-center gap-2 px-5 py-2.5 text-white rounded-full font-medium shadow-md transition-all duration-200 ${
            showForm
              ? "bg-rose-500 hover:bg-rose-600"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {showForm ? (
            <>
              <XCircle size={18} />
              Đóng form
            </>
          ) : (
            <>
              <PlusCircle size={18} />
              Thêm danh mục
            </>
          )}
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white shadow-2xl border-l-4 border-indigo-600 p-8 rounded-xl w-full max-w-xl relative animate-fade-in">
            <button
              onClick={handleCancel}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>

            <form onSubmit={handleSubmit}>
              <h3 className="text-2xl font-bold mb-6 text-indigo-700">
                {form.id ? "📁 Cập nhật danh mục" : "➕ Thêm danh mục mới"}
              </h3>

              <div className="grid gap-6">
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">
                    Tên danh mục
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full border border-gray-300 px-4 py-2 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-4 justify-end">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
                >
                  {form.id ? "💾 Cập nhật" : "➕ Thêm"}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white border border-gray-200 shadow hover:shadow-xl hover:-translate-y-1 transition-all rounded-xl p-5 flex flex-col justify-between"
          >
            <div>
              <h4 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
                📁 {category.name}
              </h4>
              <p className="text-gray-600 text-sm mt-2">{category.description}</p>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => handleEdit(category)}
                className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
              >
                <Pencil size={18} />
                <span>Sửa</span>
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="text-red-600 hover:text-red-800 flex items-center gap-1 font-medium"
              >
                <Trash2 size={18} />
                <span>Xóa</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
