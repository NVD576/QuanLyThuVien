package com.nvd.library.services.Impl;

import com.nvd.library.pojo.Comment;
import com.nvd.library.pojo.Rating;
import com.nvd.library.repository.BookRepository;
import com.nvd.library.repository.RatingRepository;
import com.nvd.library.services.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RatingServiceImpl implements RatingService {
    @Autowired
    private RatingRepository ratingRepository;
    @Autowired
    private BookRepository bookRepository;

    @Override
    public Page<Rating> getAllRatings(Pageable pageable) {
        return ratingRepository.findAll(pageable);
    }
    @Override
    public Rating getRatingById(int id) {
        return this.ratingRepository.findById(id).orElse(null);
    }

    @Override
    public Rating addRating(Rating rating) {
        return this.ratingRepository.save(rating);
    }

    @Override
    public Rating updateRating(Rating rating) {
        return this.ratingRepository.save(rating);
    }

    @Override
    public void deleteRating(int id) {
        this.ratingRepository.deleteById(id);
    }

    @Override
    public Double getAverageRating(Integer bookId) {
        if (!bookRepository.existsById(bookId)) {
            throw new IllegalArgumentException("Không tìm thấy sách với ID: " + bookId);
        }
        return ratingRepository.getAverageRatingByBookId(bookId);
    }
    public Page<Rating> getRatingsByBookId(Integer bookId, Pageable pageable) {
        return ratingRepository.findByBookId(bookId, pageable);
    }
    public Rating getRatingByBookAndUser(Integer bookId, Integer userId) {
        return ratingRepository.findByBookIdAndUserId(bookId, userId);
    }

}
