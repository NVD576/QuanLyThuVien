import { useState, useEffect } from "react";
import { authApis, endpoints } from "../configs/API";
import LoadingSpinner from "./layouts/LoadingSpinner";

const AddBookForm = ({ book, onSubmit, onCancel }) => {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [totalCopies, setTotalCopies] = useState(1);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await authApis().get(endpoints.categories);
        setCategories(res.data);
      } catch (err) {
        console.error("Lỗi tải thể loại:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (book) {
      setId(book.id || "");
      setTitle(book.title || "");
      setAuthor(book.author || "");
      setPublisher(book.publisher || "");
      setPublicationYear(book.publicationYear || "");
      setTotalCopies(book.totalCopies || 1);
      setDescription(book.description || "");
      setPrice(book.price || "");
      setSelectedCategories(book.categories?.map((c) => c.id) || []);
      setImage(null);
    } else {
      resetForm();
    }
  }, [book]);

  const resetForm = () => {
    setId("");
    setTitle("");
    setAuthor("");
    setPublisher("");
    setPublicationYear("");
    setTotalCopies(1);
    setDescription("");
    setPrice("");
    setSelectedCategories([]);
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    if (id) form.append("id", id);
    form.append("code", "")
    form.append("title", title);
    form.append("author", author);
    form.append("publisher", publisher);
    form.append("publicationYear", publicationYear);
    form.append("totalCopies", totalCopies);
    form.append("description", description);
    form.append("price", price);
    if (image) form.append("file", image);
    selectedCategories.forEach((c) => form.append("categoryIds", c));
    for (const [key, value] of form.entries()) {
      console.log(`${key}: ${value}`);
    }
    try {
      setLoading(true);
      await onSubmit(form);
      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-6"
    >
      <h2 className="text-2xl font-bold text-center text-blue-600">
        {book ? "Cập nhật Sách" : "Thêm Sách Mới"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center">
          <label className="label font-semibold">Ảnh bìa</label>
          {(image || book?.image) && (
            <img
              src={image ? URL.createObjectURL(image) : book?.image}
              alt="Xem trước ảnh"
              className="mt-4 w-48 h-64 object-cover rounded-lg border"
            />
          )}
          <div>
            <input
              id="upload"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="hidden"
            />
            <label
              htmlFor="upload"
              className="btn btn-outline btn-primary w-full text-center"
            >
              📁 Chọn ảnh bìa
            </label>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label font-semibold">Tiêu đề</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label font-semibold">Tác giả</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label font-semibold">Nhà xuất bản</label>
              <input
                type="text"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label font-semibold">Năm xuất bản</label>
              <input
                type="number"
                value={publicationYear}
                onChange={(e) => setPublicationYear(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label font-semibold">Số lượng</label>
              <input
                type="number"
                value={totalCopies}
                onChange={(e) => setTotalCopies(e.target.value)}
                className="input input-bordered w-full"
                min={1}
              />
            </div>

            <div className="form-control">
              <label className="label font-semibold">Giá</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="input input-bordered w-full"
                step="0.01"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label font-semibold">Mô tả</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea textarea-bordered w-full"
            />
          </div>

          <div>
            <label className="font-medium mb-2 block">Chọn thể loại:</label>
            <div className="flex flex-wrap gap-3">
              {categories.map((c) => (
                <label key={c.id} className="label cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selectedCategories.includes(c.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCategories([...selectedCategories, c.id]);
                      } else {
                        setSelectedCategories(
                          selectedCategories.filter((id) => id !== c.id)
                        );
                      }
                    }}
                  />
                  <span className="ml-2">{c.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button type="submit" className="btn btn-primary w-full">
        {book ? "Cập nhật sách" : "Thêm sách"}
      </button>

      {loading && <LoadingSpinner />}
    </form>
  );
};

export default AddBookForm;
