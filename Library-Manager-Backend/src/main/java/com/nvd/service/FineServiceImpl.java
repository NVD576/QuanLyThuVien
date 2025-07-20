package com.nvd.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nvd.entity.Fine;
import com.nvd.repository.FineRepository;

@Service
public class FineServiceImpl implements FineService {
    @Autowired
    private FineRepository fineRepository;

    @Override
    public List<Fine> getAll() {
        return fineRepository.findAll();
    }

    @Override
    public Fine getById(Integer id) {
        Optional<Fine> fine = fineRepository.findById(id);
        return fine.orElse(null);
    }

    @Override
    public Fine save(Fine fine) {
        return fineRepository.save(fine);
    }

    @Override
    public void delete(Integer id) {
        fineRepository.deleteById(id);
    }
} 