package com.nvd.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nvd.entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
} 