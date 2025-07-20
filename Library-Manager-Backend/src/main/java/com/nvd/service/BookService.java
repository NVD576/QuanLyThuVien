package com.nvd.service;

import java.util.List;

import com.nvd.dto.BookDTO;
import com.nvd.entity.Book;

public interface BookService {
    List<Book> getAll();
    Book getById(Integer id);
    Book save(Book book);
    void delete(Integer id);
    BookDTO createBook(BookDTO bookDTO);
} 