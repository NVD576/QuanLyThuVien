package com.nvd.service;

import java.util.List;

import com.nvd.dto.UserDTO;
import com.nvd.entity.User;

public interface UserService {
    List<User> getAll();
    User getById(Integer id);
    User save(User user);
    void delete(Integer id);
    UserDTO registerUser(UserDTO userDTO);
} 