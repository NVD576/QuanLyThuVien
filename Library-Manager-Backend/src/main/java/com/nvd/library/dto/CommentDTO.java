package com.nvd.library.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class CommentDTO {
    private Integer id;
    private Integer userId;
    private String userName;
    private Integer bookId;
    private String bookTitle;
    private String commentText;
    private LocalDateTime commentDate;
}
