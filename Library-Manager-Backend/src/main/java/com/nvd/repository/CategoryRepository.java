package com.nvd.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nvd.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
} 