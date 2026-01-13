package com.nvd.library.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class RatingDTO {
    private Integer id;
    private Integer userId;
    private Integer bookId;
    private Byte ratingValue;
    private LocalDate ratingDate;
}
