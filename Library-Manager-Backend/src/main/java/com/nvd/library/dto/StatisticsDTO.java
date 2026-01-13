package com.nvd.library.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class StatisticsDTO {
    private long totalBooks;
    private Long totalCopies;
    private Long availableCopies;
    private long borrowedBooks;
    private long overdueBooks;
    private BigDecimal totalFines;
    private BigDecimal totalFinesReturned;
    private long totalReaders;
    private long totalLibrarians;
}
