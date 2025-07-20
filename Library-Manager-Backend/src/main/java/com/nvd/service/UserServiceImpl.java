package com.nvd.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nvd.dto.UserDTO;
import com.nvd.entity.User;
import com.nvd.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public List<User> getAll() {
        return userRepository.findAll();
    }

    @Override
    public User getById(Integer id) {
        Optional<User> user = userRepository.findById(id);
        return user.orElse(null);
    }

    @Override
    public User save(User user) {
        return userRepository.save(user);
    }

    @Override
    public void delete(Integer id) {
        userRepository.deleteById(id);
    }

    @Override
    public UserDTO registerUser(UserDTO userDTO) {
        User user = new User();
        user.setFullName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        user.setPhone(userDTO.getPhone());
        user.setAddress(userDTO.getAddress());
        user.setAvatar(userDTO.getAvatar());
        user.setRole(userDTO.getRole() != null ? User.Role.valueOf(userDTO.getRole()) : null);
        user.setStatus(userDTO.getStatus() != null ? User.Status.valueOf(userDTO.getStatus()) : null);
        // ... các trường khác nếu có ...

        User saved = userRepository.save(user);

        return UserDTO.builder()
            .userId(saved.getUserId())
            .name(saved.getFullName())
            .email(saved.getEmail())
            .phone(saved.getPhone())
            .address(saved.getAddress())
            .avatar(saved.getAvatar())
            .role(saved.getRole() != null ? saved.getRole().name() : null)
            .status(saved.getStatus() != null ? saved.getStatus().name() : null)
            .build();
    }
} 