package com.nvd.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nvd.entity.Borrow;
import com.nvd.repository.BorrowRepository;

@Service
public class BorrowServiceImpl implements BorrowService {
    @Autowired
    private BorrowRepository borrowRepository;

    @Override
    public List<Borrow> getAll() {
        return borrowRepository.findAll();
    }

    @Override
    public Borrow getById(Integer id) {
        Optional<Borrow> borrow = borrowRepository.findById(id);
        return borrow.orElse(null);
    }

    @Override
    public Borrow save(Borrow borrow) {
        return borrowRepository.save(borrow);
    }

    @Override
    public void delete(Integer id) {
        borrowRepository.deleteById(id);
    }
} 