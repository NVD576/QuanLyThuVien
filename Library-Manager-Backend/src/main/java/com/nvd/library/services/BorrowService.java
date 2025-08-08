package com.nvd.library.services;

import com.nvd.library.dto.BorrowDTO;
import com.nvd.library.pojo.Borrow;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BorrowService {
    List<Borrow> getAllBorrow();
    Borrow getBorrowById(Integer borrowId);
    List<Borrow> getBorrowByUserId(Integer userId);
    List<Borrow> getBorrowByBookId(Integer bookId);
    List<Borrow> getBorrowByBookIdAndUserId(Integer bookId, Integer userId);
    Borrow addBorrow(Borrow borrow);
    Borrow updateBorrow(Borrow borrow);
    void deleteBorrowById(Integer borrowId);
    Page<BorrowDTO> searchBorrows(String keyword, Pageable pageable);
}
