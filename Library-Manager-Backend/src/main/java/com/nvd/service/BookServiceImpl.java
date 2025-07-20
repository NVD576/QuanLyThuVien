package com.nvd.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nvd.dto.BookDTO;
import com.nvd.entity.Book;
import com.nvd.repository.BookRepository;

@Service
public class BookServiceImpl implements BookService {
    @Autowired
    private BookRepository bookRepository;

    @Override
    public List<Book> getAll() {
        return bookRepository.findAll();
    }

    @Override
    public Book getById(Integer id) {
        Optional<Book> book = bookRepository.findById(id);
        return book.orElse(null);
    }

    @Override
    public Book save(Book book) {
        return bookRepository.save(book);
    }

    @Override
    public void delete(Integer id) {
        bookRepository.deleteById(id);
    }

    @Override
    public BookDTO createBook(BookDTO bookDTO) {
        Book book = new Book();
        book.setTitle(bookDTO.getTitle());
        book.setPublisher(bookDTO.getPublisher());
        book.setPublicationYear(bookDTO.getPublicationYear());
        book.setImage(bookDTO.getImage());
        book.setTotalCopies(bookDTO.getTotalCopies());
        book.setAvailableCopies(bookDTO.getAvailableCopies());
        book.setStatus(bookDTO.getStatus() != null ? Book.BookStatus.valueOf(bookDTO.getStatus()) : null);
        book.setDescription(bookDTO.getDescription());
        book.setPrice(bookDTO.getPrice());
        // Nếu có categoryId thì set category (nếu cần)
        // ...
        Book saved = bookRepository.save(book);
        // Trả về BookDTO
        return BookDTO.builder()
            .bookId(saved.getBookId())
            .title(saved.getTitle())
            .publisher(saved.getPublisher())
            .publicationYear(saved.getPublicationYear())
            .categoryId(saved.getCategory() != null ? saved.getCategory().getCategoryId() : null)
            .image(saved.getImage())
            .totalCopies(saved.getTotalCopies())
            .availableCopies(saved.getAvailableCopies())
            .status(saved.getStatus() != null ? saved.getStatus().name() : null)
            .description(saved.getDescription())
            .price(saved.getPrice())
            .build();
    }
} 