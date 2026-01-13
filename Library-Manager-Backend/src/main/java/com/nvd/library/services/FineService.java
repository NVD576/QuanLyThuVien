package com.nvd.library.services;

import com.nvd.library.pojo.Fine;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface FineService {
    Page<Fine> getAllFines(Pageable pageable);
    Fine getFineById(int id);
    List<Fine> getFinesByUserId(Integer userId);
    Fine addFine(Fine fine);
    Fine updateFine(Fine fine);
    void deleteFine(int id);
    Fine getFineByBorrowId(int borrowId);
}
