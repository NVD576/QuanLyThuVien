package com.nvd.library.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BorrowDTO {
    Integer id;
    Integer userId;
    Integer printBookId;
    String userFullName;
    String bookTitle;
    LocalDate borrowDate;
    LocalDate dueDate;
    LocalDate returnDate;
    String status;
}
