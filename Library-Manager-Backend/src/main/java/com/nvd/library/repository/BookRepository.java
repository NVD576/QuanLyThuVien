package com.nvd.library.repository;

import com.nvd.library.pojo.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {

    @Query("SELECT b FROM Book b LEFT JOIN b.categories c WHERE " +
            "(:search IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "   OR LOWER(b.code) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "   OR LOWER(b.publisher) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
            "(:category IS NULL OR c.name = :category) AND " +
            "(:publishedYear IS NULL OR b.publicationYear = :publishedYear)")
    Page<Book> findBooksWithFilters(
            @Param("search") String search,
            @Param("category") String category,
            @Param("publishedYear") Integer publishedYear,
            Pageable pageable
    );
}
