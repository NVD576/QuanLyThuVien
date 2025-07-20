package com.nvd.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookDTO {
    private Integer bookId;
    private String title;
    private String publisher;
    private Integer publicationYear;
    private Integer categoryId;
    private String image;
    private Integer totalCopies;
    private Integer availableCopies;
    private String status;
    private String description;
    private BigDecimal price;
} 