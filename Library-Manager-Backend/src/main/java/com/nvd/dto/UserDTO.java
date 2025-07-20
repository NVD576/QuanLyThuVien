package com.nvd.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Integer userId;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String avatar;    // URL ảnh đại diện (Cloudinary)
    private String role;      // Vai trò: ADMIN, USER, ...
    private String status;    // Trạng thái: ACTIVE, INACTIVE, ...
} 