package com.nvd.service;

import com.nvd.dto.AuthRequest;
import com.nvd.dto.AuthResponse;
import com.nvd.dto.RegisterRequest;

public interface AuthService {
    AuthResponse login(AuthRequest request);
    AuthResponse register(RegisterRequest request);
    AuthResponse refreshToken(String refreshToken);
} 