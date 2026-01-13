package com.nvd.library.repository;

import com.nvd.library.pojo.Rating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Integer> {
    @Query("SELECT COALESCE(AVG(r.ratingValue), 0.0) FROM Rating r WHERE r.book.id = :bookId")
    Double getAverageRatingByBookId(Integer bookId);
    Page<Rating> findByBookId(Integer bookId, Pageable pageable);
    Rating findByBookIdAndUserId(Integer bookId, Integer userId);
}
