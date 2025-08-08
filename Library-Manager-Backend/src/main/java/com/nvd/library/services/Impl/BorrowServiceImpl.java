package com.nvd.library.services.Impl;

import com.nvd.library.dto.BorrowDTO;
import com.nvd.library.pojo.Borrow;
import com.nvd.library.repository.BorrowRepository;
import com.nvd.library.services.BorrowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BorrowServiceImpl implements BorrowService {
    @Autowired
    private BorrowRepository borrowRepository;


    @Override
    public List<Borrow> getAllBorrow() {
        return borrowRepository.findAll();
    }

    @Override
    public Borrow getBorrowById(Integer borrowId) {
        return   borrowRepository.findById(borrowId).orElse(null);
    }

    @Override
    public Page<BorrowDTO> searchBorrows(String keyword, Pageable pageable) {
        Page<Borrow> borrowPage;

        if (keyword == null || keyword.trim().isEmpty()) {
            borrowPage = borrowRepository.findAll(pageable);
        } else {
            borrowPage = borrowRepository.searchByUserOrBook(keyword.trim(), pageable);
        }

        return borrowPage.map(b -> {
            String userFullName = b.getUser().getFirstName() + " " + b.getUser().getLastName();
            String bookTitle = b.getPrintBook().getBook().getTitle();
            return new BorrowDTO(
                    b.getId(),
                    b.getUser().getId(), // <- thêm userId
                    b.getPrintBook().getId(),
                    userFullName,
                    bookTitle,
                    b.getBorrowDate(),
                    b.getDueDate(),
                    b.getReturnDate(),
                    b.getStatus()
            );
        });
    }

    @Override
    public List<Borrow> getBorrowByUserId(Integer userId) {
        return borrowRepository.findByUserId(userId);
    }

    @Override
    public List<Borrow> getBorrowByBookId(Integer bookId) {
        return borrowRepository.findByPrintBookId(bookId);
    }

    @Override
    public List<Borrow> getBorrowByBookIdAndUserId(Integer bookId, Integer userId) {
        return borrowRepository.findByUser_IdAndPrintBook_Book_Id(userId, bookId);
    }

    @Override
    public Borrow addBorrow(Borrow borrow) {
        return borrowRepository.save(borrow);
    }

    @Override
    public Borrow updateBorrow(Borrow borrow) {
        return borrowRepository.save(borrow);
    }

    @Override
    public void deleteBorrowById(Integer borrowId) {
        this.borrowRepository.deleteById(borrowId);
    }
}
