package com.nvd.service;

import java.util.List;

import com.nvd.entity.Borrow;

public interface BorrowService {
    List<Borrow> getAll();
    Borrow getById(Integer id);
    Borrow save(Borrow record);
    void delete(Integer id);
} 