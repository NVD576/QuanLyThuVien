package com.nvd.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RestController;

import com.nvd.dto.BookDTO;
import com.nvd.entity.Book;
import com.nvd.service.BookService;
import com.nvd.service.CloudinaryService;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/books")
public class BookController {
    @Autowired
    private BookService bookService;

    @Autowired
    private CloudinaryService cloudinaryService;

    @GetMapping
    public List<BookDTO> getAll() {
        return bookService.getAll().stream().map(book -> BookDTO.builder()
                .bookId(book.getBookId())
                .title(book.getTitle())
                .publisher(book.getPublisher())
                .publicationYear(book.getPublicationYear())
                .categoryId(book.getCategory() != null ? book.getCategory().getCategoryId() : null)
                .image(book.getImage())
                .totalCopies(book.getTotalCopies())
                .availableCopies(book.getAvailableCopies())
                .status(book.getStatus() != null ? book.getStatus().name() : null)
                .description(book.getDescription())
                .price(book.getPrice())
                .build()
        ).toList();
    }

    @GetMapping("/{id}")
    public Book getById(@PathVariable Integer id) {
        return bookService.getById(id);
    }

    @PostMapping
    public Book save(@RequestBody Book book) {
        return bookService.save(book);
    }

    @PostMapping("/create")
    public ResponseEntity<BookDTO> createBook(
        @RequestPart("book") BookDTO bookDTO,
        @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) {
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = cloudinaryService.uploadFile(imageFile);
            bookDTO.setImage(imageUrl);
        }
        BookDTO savedBook = bookService.createBook(bookDTO);
        return ResponseEntity.ok(savedBook);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        bookService.delete(id);
    }
} 