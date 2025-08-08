package com.nvd.library.services.Impl;

import com.nvd.library.pojo.Category;
import com.nvd.library.repository.CategoryRepository;
import com.nvd.library.services.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<Category> getAllCategories() {
        return this.categoryRepository.findAll();
    }

    @Override
    public Category getCategoryById(Integer id) {
        return this.categoryRepository.findById(id).get();
    }


    @Override
    public Category addCategory(Category category) {
        return this.categoryRepository.save(category);
    }

    @Override
    public Category updateCategory(Category category) {
        return this.categoryRepository.save(category);
    }

    @Override
    public void deleteCategoryById(Integer id) {
        this.categoryRepository.deleteById(id);
    }
}
