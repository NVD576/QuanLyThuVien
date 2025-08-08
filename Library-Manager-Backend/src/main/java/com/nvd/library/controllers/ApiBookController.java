package com.nvd.library.controllers;

import com.nvd.library.dto.BookDTO;
import com.nvd.library.pojo.Book;
import com.nvd.library.services.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ApiBookController {
    @Autowired
    private BookService bookService;

    @GetMapping("/books")
    public ResponseEntity<Page<Book>> getAllBook(
            @RequestParam Map<String, String> allParams,
            @PageableDefault(size = 8, sort = "id", direction = Sort.Direction.ASC) Pageable pageable){
        Page<Book> books =  bookService.getAllBook(allParams, pageable);
        return ResponseEntity.ok(books);
    }

    @GetMapping("/books/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable int id){
        return ResponseEntity.ok(this.bookService.getBookById(id));
    }

    @PostMapping("/books/add")
    public ResponseEntity<Book> addBook(@ModelAttribute BookDTO bookDTO){
        return ResponseEntity.ok(this.bookService.addBook(bookDTO));
    }

    @PatchMapping("/books/update")
    public ResponseEntity<Book> updateBook(@ModelAttribute BookDTO BookDTO){
        return ResponseEntity.ok(this.bookService.updateBook(BookDTO));
    }

    @DeleteMapping("/books/{id}/delete")
    public ResponseEntity<String> deleteBook(@PathVariable int id){
        this.bookService.deleteBook(id);
        return ResponseEntity.ok("ok");

    }

}
