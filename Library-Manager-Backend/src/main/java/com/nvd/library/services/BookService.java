package com.nvd.library.services;

import com.nvd.library.dto.BookDTO;
import com.nvd.library.pojo.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Map;

public interface BookService {
    public Page<Book> getAllBook(Map<String, String> params, Pageable pageable);
    public Book getBookById(int bookId);
    public Book addBook(BookDTO bookDTO);
    public Book updateBook(BookDTO bookDTO);
    public void deleteBook(int bookId);

}
