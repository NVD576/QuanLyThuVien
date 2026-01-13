package com.nvd.library.repository;

import com.nvd.library.pojo.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {

    @Query("SELECT b FROM Book b LEFT JOIN b.categories c WHERE " +
            "(:search IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "   OR LOWER(b.author) LIKE LOWER(CONCAT('%', :search, '%')) " +   // thêm điều kiện tìm theo author
            "   OR LOWER(b.publisher) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
            "(:category IS NULL OR c.name = :category) AND " +
            "(:publishedYear IS NULL OR b.publicationYear = :publishedYear)")
    Page<Book> findBooksWithFilters(
            @Param("search") String search,
            @Param("category") String category,
            @Param("publishedYear") Integer publishedYear,
            Pageable pageable
    );

    long countByIsActiveTrue();
    @Query("SELECT COUNT(pb) FROM PrintBook pb ")
    Long sumTotalCopies();
    @Query("SELECT COUNT(pb) FROM PrintBook pb WHERE pb.status = 'Available'")
    Long sumAvailableCopies(); // Use Long to allow null

}
