import React, { useContext } from "react";
import { FaSearch } from "react-icons/fa";
import { BookContext } from "../context/BookContext";
import useCategories from "../hooks/useCategories";

const SearchBar = ({ placeholder }) => {
  const {
    handleSearch,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
  } = useContext(BookContext);
  const { categories } = useCategories();

  return (
    <div className="mb-3">
      <div className="flex gap-2">
        <div className="flex items-center px-3 bg-gray-100 rounded">
          <FaSearch className="text-gray-500" />
        </div>
        <input
          type="text"
          className="flex-grow px-4 py-2 border border-gray-300 rounded"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="px-2 py-2 border border-gray-300 rounded w-40"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() =>
            handleSearch({ search: searchTerm, cate: selectedCategory })
          }
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
