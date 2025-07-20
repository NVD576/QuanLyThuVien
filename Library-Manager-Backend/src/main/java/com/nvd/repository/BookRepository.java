package com.nvd.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nvd.entity.Book;

public interface BookRepository extends JpaRepository<Book, Integer> {
} 