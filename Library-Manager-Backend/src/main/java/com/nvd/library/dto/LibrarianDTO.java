package com.nvd.library.dto;

import com.nvd.library.pojo.Librarian;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Data
public class LibrarianDTO {
    private int id;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;
    private String username;
    private String password;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String address;
    private String role;
    private Boolean isActive;
    private MultipartFile file;
}
