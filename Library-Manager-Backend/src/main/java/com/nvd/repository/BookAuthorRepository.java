package com.nvd.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nvd.entity.BookAuthor;

public interface BookAuthorRepository extends JpaRepository<BookAuthor, Integer> {
} 