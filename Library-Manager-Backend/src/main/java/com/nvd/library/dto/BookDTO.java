package com.nvd.library.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class BookDTO {
    private Integer id;
    private String code;
    private String title;
    private String author;
    private Integer totalCopies;
    private Integer availableCopies;
    private String publisher;
    private Integer publicationYear;
    private String description;
    private BigDecimal price;
    private String image;
    private Boolean isActive;
    private List<Integer> categoryIds; // ID của các thể loại
    private MultipartFile file; // File ảnh được upload
}
