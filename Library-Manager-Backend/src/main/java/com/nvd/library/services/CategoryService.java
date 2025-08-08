package com.nvd.library.services;

import com.nvd.library.pojo.Category;

import java.util.List;

public interface CategoryService {
    List<Category> getAllCategories();
    Category getCategoryById(Integer id);
    Category addCategory(Category category);
    Category updateCategory(Category category);
    void deleteCategoryById(Integer id);

}
