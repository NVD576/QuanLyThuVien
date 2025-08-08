package com.nvd.library.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class ReaderDTO {
    private int id;
    private String membershipLevel;
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