package com.nvd.service;

import java.util.List;

import com.nvd.entity.Author;

public interface AuthorService {
    List<Author> getAll();
    Author getById(Integer id);
    Author save(Author author);
    void delete(Integer id);
} 