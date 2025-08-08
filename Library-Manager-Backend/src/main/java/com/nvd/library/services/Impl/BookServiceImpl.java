package com.nvd.library.services.Impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.nvd.library.dto.BookDTO;
import com.nvd.library.pojo.Book;
import com.nvd.library.pojo.Category;
import com.nvd.library.repository.BookRepository;
import com.nvd.library.repository.CategoryRepository;
import com.nvd.library.services.BookService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private Cloudinary cloudinary;
    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public Page<Book> getAllBook(Map<String, String> params, Pageable pageable) {
        String search = params.get("search");
        String category = params.get("category");
        String publishedYearStr = params.get("publicationYear");

        // Parse parameters
        Integer publicationYear = null;
        Double minPrice = null;
        Double maxPrice = null;

        try {
            if (publishedYearStr != null && !publishedYearStr.isEmpty()) {
                publicationYear = Integer.parseInt(publishedYearStr);
            }
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid number format in parameters", e);
        }

        // Nếu không có filter parameters, trả về tất cả
        if (isAllParamsEmpty(search, category, publicationYear, minPrice, maxPrice)) {
            return bookRepository.findAll(pageable);
        }

        // Sử dụng custom query với filters
        return bookRepository.findBooksWithFilters(
                search,category,  publicationYear, pageable);
    }
    private boolean isAllParamsEmpty(String search, String category,
                                     Integer publicationYear, Double minPrice, Double maxPrice) {
        return (search == null || search.trim().isEmpty()) &&
                (category == null || category.trim().isEmpty()) &&
                publicationYear == null &&
                minPrice == null &&
                maxPrice == null;
    }
    @Override
    public Book getBookById(int bookId) {
        Optional<Book> book = bookRepository.findById(bookId);
        return book.orElse(null);
    }

    private String generateBookCode() {
        long count = bookRepository.count() + 1; // Đếm số sách hiện có
        return String.format("B%03d", count);
    }
    @Override
    @Transactional
    public Book addBook(BookDTO bookDTO) {
        Book book = new Book();
        // Nếu không truyền code, tự động generate code bắt đầu bằng "B"
        if (bookDTO.getCode() == null || bookDTO.getCode().trim().isEmpty()) {
            String generatedCode = generateBookCode();
            book.setCode(generatedCode);
        } else {
            book.setCode(bookDTO.getCode());
        }
        // Set thông tin sách
        book.setTitle(bookDTO.getTitle());
        book.setAuthor(bookDTO.getAuthor());
        book.setTotalCopies(bookDTO.getTotalCopies());
        book.setAvailableCopies(bookDTO.getTotalCopies());
        book.setPublisher(bookDTO.getPublisher());
        book.setPublicationYear(bookDTO.getPublicationYear());
        book.setDescription(bookDTO.getDescription());
        book.setPrice(bookDTO.getPrice());
        book.setIsActive(bookDTO.getIsActive());

        // Set ảnh (giả sử bạn lưu ảnh ra thư mục và lưu đường dẫn vào DB)
        if (bookDTO.getFile() != null && !bookDTO.getFile().isEmpty()) {
            try {
                Map res = cloudinary.uploader().upload(bookDTO.getFile().getBytes(), ObjectUtils.asMap("resource_type", "auto"));
                book.setImage(res.get("secure_url").toString());
            } catch (IOException ex) {
                Logger.getLogger(UserServiceImpl.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

        // Set thể loại
        if (bookDTO.getCategoryIds() != null && !bookDTO.getCategoryIds().isEmpty()) {
            Set<Category> categories = new HashSet<>(categoryRepository.findAllById(bookDTO.getCategoryIds()));
            book.setCategories(categories);
}

        return bookRepository.save(book);
    }

    @Override
    @Transactional
    public Book updateBook(BookDTO bookDTO) {
        Book book = this.bookRepository.findById(bookDTO.getId()).orElse(null);
        if (book == null) {
            throw new IllegalArgumentException("Không tìm thấy sách với ID: " + bookDTO.getId());
        }
        // Set thông tin sách
        book.setCode(bookDTO.getCode());
        book.setTitle(bookDTO.getTitle());
        book.setAuthor(bookDTO.getAuthor());
        book.setTotalCopies(bookDTO.getTotalCopies());
        book.setPublisher(bookDTO.getPublisher());
        book.setPublicationYear(bookDTO.getPublicationYear());
        book.setDescription(bookDTO.getDescription());
        book.setPrice(bookDTO.getPrice());
        book.setIsActive(bookDTO.getIsActive());

        // Set ảnh (giả sử bạn lưu ảnh ra thư mục và lưu đường dẫn vào DB)
        if (bookDTO.getFile() != null && !bookDTO.getFile().isEmpty()) {
            try {
                Map res = cloudinary.uploader().upload(bookDTO.getFile().getBytes(), ObjectUtils.asMap("resource_type", "auto"));
                book.setImage(res.get("secure_url").toString());
            } catch (IOException ex) {
                Logger.getLogger(UserServiceImpl.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

        // Set thể loại
        if (bookDTO.getCategoryIds() != null && !bookDTO.getCategoryIds().isEmpty()) {
            Set<Category> categories = new HashSet<>(categoryRepository.findAllById(bookDTO.getCategoryIds()));
            book.setCategories(categories);
        }

        return this.bookRepository.save(book);
    }

    @Override
    @Transactional
    public void deleteBook(int bookId) {
        if (bookId < 0){
            throw  new IllegalArgumentException("Book not found id");
        }
        this.bookRepository.deleteById(bookId);
    }
}
