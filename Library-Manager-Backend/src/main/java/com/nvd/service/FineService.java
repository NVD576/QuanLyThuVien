package com.nvd.service;

import java.util.List;

import com.nvd.entity.Fine;

public interface FineService {
    List<Fine> getAll();
    Fine getById(Integer id);
    Fine save(Fine fine);
    void delete(Integer id);
} 