package com.nvd.service;

import com.nvd.dto.AuthRequest;
import com.nvd.dto.AuthResponse;
import com.nvd.dto.RegisterRequest;
import com.nvd.entity.User;
import com.nvd.repository.UserRepository;
import com.nvd.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public AuthResponse login(AuthRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty() || !passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
            throw new RuntimeException("Email hoặc mật khẩu không đúng!");
        }
        User user = userOpt.get();
        String accessToken = jwtUtil.generateAccessToken(user.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());
        return new AuthResponse(accessToken, refreshToken, user.getRole().name());
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã tồn tại!");
        }
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.valueOf(request.getRole() != null ? request.getRole() : "Member"))
                .status(User.Status.Active)
                .build();
        userRepository.save(user);
        String accessToken = jwtUtil.generateAccessToken(user.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());
        return new AuthResponse(accessToken, refreshToken, user.getRole().name());
    }

    @Override
    public AuthResponse refreshToken(String refreshToken) {
        String email = jwtUtil.extractUsername(refreshToken);
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty() || !jwtUtil.validateToken(refreshToken, email)) {
            throw new RuntimeException("Refresh token không hợp lệ!");
        }
        String newAccessToken = jwtUtil.generateAccessToken(email);
        String newRefreshToken = jwtUtil.generateRefreshToken(email);
        return new AuthResponse(newAccessToken, newRefreshToken, userOpt.get().getRole().name());
    }
} 