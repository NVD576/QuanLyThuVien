package com.nvd.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nvd.entity.Fine;

public interface FineRepository extends JpaRepository<Fine, Integer> {
} 