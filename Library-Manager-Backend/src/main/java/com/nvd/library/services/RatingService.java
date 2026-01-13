package com.nvd.library.services;

import com.nvd.library.pojo.Comment;
import com.nvd.library.pojo.Rating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface RatingService {
    Page<Rating> getAllRatings(Pageable pageable);
    Rating getRatingById(int id);
    Rating addRating(Rating rating);
    Rating updateRating(Rating rating);
    void deleteRating(int id);
    Double getAverageRating(Integer bookId);
    Page<Rating> getRatingsByBookId(Integer bookId, Pageable pageable);
    Rating getRatingByBookAndUser(Integer bookId, Integer userId);
}
