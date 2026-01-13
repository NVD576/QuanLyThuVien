package com.nvd.library.services.Impl;

import com.nvd.library.pojo.Fine;
import com.nvd.library.repository.FineRepository;
import com.nvd.library.services.FineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FineServiceImpl implements FineService {
    @Autowired
    FineRepository fineRepository;
    @Override
    public Page<Fine> getAllFines(Pageable pageable) {
        return fineRepository.findAll(pageable);
    }

    @Override
    public Fine getFineById(int id) {
        return this.fineRepository.getFinesById(id);
    }
    public List<Fine> getFinesByUserId(Integer userId) {
        return fineRepository.findByUserId(userId);
    }
    @Override
    public Fine addFine(Fine fine) {
        return this.fineRepository.save(fine);
    }

    @Override
    public Fine updateFine(Fine fine) {
        return this.fineRepository.save(fine);
    }

    @Override
    public void deleteFine(int id) {
        this.fineRepository.deleteById(id);
    }
    @Override
    public Fine getFineByBorrowId(int borrowId) {
        return fineRepository.findByBorrow_Id(borrowId);
    }

}
