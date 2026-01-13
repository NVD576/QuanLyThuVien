package com.nvd.library.controllers;

import com.nvd.library.dto.RatingDTO;
import com.nvd.library.pojo.Book;
import com.nvd.library.pojo.Rating;
import com.nvd.library.pojo.User;
import com.nvd.library.services.BookService;
import com.nvd.library.services.RatingService;
import com.nvd.library.services.UserService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ApiRatingController {
    @Autowired
    private RatingService ratingService;
    @Autowired
    private BookService bookService;
    @Autowired
    private UserService userService;

    @GetMapping("/ratings")
    public ResponseEntity<Page<Rating>> getRatings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("ratingDate").descending());
        Page<Rating> ratings = ratingService.getAllRatings(pageable);
        return ResponseEntity.ok(ratings);
    }

    @GetMapping("/rating/{bookId}/user/{userId}")
    public ResponseEntity<?> getUserRatingForBook(
            @PathVariable Integer bookId,
            @PathVariable Integer userId) {
        try {
            Rating rating = ratingService.getRatingByBookAndUser(bookId, userId);
            if (rating != null) {
                return ResponseEntity.ok(rating);
            } else {
                return ResponseEntity.ok(null);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi server: " + e.getMessage());
        }
    }
    @GetMapping("/rating/book/{bookId}")
    public ResponseEntity<?> getRatingsByBookId(
            @PathVariable Integer bookId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by("ratingDate").descending());
            Page<Rating> ratings = ratingService.getRatingsByBookId(bookId, pageable);
            return ResponseEntity.ok(ratings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi server: " + e.getMessage());
        }
    }

    @GetMapping("/rating/{id}")
    public ResponseEntity<?> getRatingById(@PathVariable("id") int id){
        return ResponseEntity.ok(this.ratingService.getRatingById(id));
    }

    @GetMapping("/rating/{bookId}/average")
    public ResponseEntity<?> getAverageRating(@PathVariable Integer bookId) {
        try {
            Double averageRating = ratingService.getAverageRating(bookId);
            return ResponseEntity.ok(averageRating);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi server: " + e.getMessage());
        }
    }


    @PostMapping("/rating/add")
    public ResponseEntity<?> addRating(@RequestBody RatingDTO ratingDTO){
        Rating rating = new Rating();
        rating.setRatingValue(ratingDTO.getRatingValue());
        rating.setRatingDate(ratingDTO.getRatingDate());
        User user = this.userService.getUserById(ratingDTO.getUserId());
        rating.setUser(user);
        Book book = this.bookService.getBookById(ratingDTO.getBookId());
        rating.setBook(book);
        return ResponseEntity.ok(this.ratingService.addRating(rating));
    }

    @PatchMapping("/rating/update")
    public ResponseEntity<?> updateRating(@RequestBody RatingDTO ratingDTO){
        Rating rating = this.ratingService.getRatingById(ratingDTO.getId());
        rating.setRatingValue(ratingDTO.getRatingValue());
        rating.setRatingDate(ratingDTO.getRatingDate());
        User user = this.userService.getUserById(ratingDTO.getUserId());
        rating.setUser(user);
        Book book = this.bookService.getBookById(ratingDTO.getBookId());
        rating.setBook(book);
        return ResponseEntity.ok(this.ratingService.updateRating(rating));
    }

    @DeleteMapping("/rating/{id}/delete")
    public ResponseEntity<?> deleteRating(@PathVariable("id") int id){
        this.ratingService.deleteRating(id);
        return ResponseEntity.ok("Deleted");
    }

}
