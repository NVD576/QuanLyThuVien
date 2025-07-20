package com.nvd.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nvd.entity.Author;

public interface AuthorRepository extends JpaRepository<Author, Integer> {
} 