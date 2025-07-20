package com.nvd.service;

import java.util.List;

import com.nvd.entity.Category;

public interface CategoryService {
    List<Category> getAll();
    Category getById(Integer id);
    Category save(Category category);
    void delete(Integer id);
} 