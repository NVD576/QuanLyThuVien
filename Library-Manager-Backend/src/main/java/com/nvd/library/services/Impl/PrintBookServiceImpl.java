package com.nvd.library.services.Impl;

import com.nvd.library.pojo.Book;
import com.nvd.library.pojo.PrintBook;
import com.nvd.library.repository.PrintBookRepository;
import com.nvd.library.services.BookService;
import com.nvd.library.services.PrintBookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PrintBookServiceImpl implements PrintBookService {

    @Autowired
    private PrintBookRepository printBookRepository;
    @Override
    public Page<PrintBook> getAllPrintBooks(Pageable pageable, Long bookId, String title) {
        if (bookId != null && title != null && !title.isEmpty()) {
            return printBookRepository.findByBookIdAndBookTitleContainingIgnoreCase(bookId, title, pageable);
        } else if (bookId != null) {
            return printBookRepository.findByBookId(bookId, pageable);
        } else if (title != null && !title.isEmpty()) {
            return printBookRepository.findByBookTitleContainingIgnoreCase(title, pageable);
        } else {
            return printBookRepository.findAll(pageable);
        }
    }



    @Override
    public List<PrintBook> getPrintBooksByBook_Id(Integer id) {
        return printBookRepository.findPrintBookByBook_Id(id);
    }

    @Override
    public PrintBook getPrintBookById(Integer id) {
        Optional<PrintBook> printBook =this.printBookRepository.findById(id);
        return printBook.orElse(null);
    }

    @Override
    public PrintBook addPrintBook(PrintBook printBook) {
        return printBookRepository.save(printBook);
    }


    @Override
    public PrintBook updatePrintBook(PrintBook printBook) {
        PrintBook oldPrintBook= this.printBookRepository.findById(printBook.getId()).orElseThrow(() -> new RuntimeException("PrintBook not found"));
        System.out.println("Old status: " + oldPrintBook.getStatus());
        System.out.println("New status: " + printBook.getStatus());

        if (!oldPrintBook.getStatus().equals(printBook.getStatus())) {
            if ("Available".equals(printBook.getStatus())) {
                oldPrintBook.getBook().setAvailableCopies(printBook.getBook().getAvailableCopies() + 1);
            } else {
                oldPrintBook.getBook().setAvailableCopies(printBook.getBook().getAvailableCopies() - 1);
            }
        }

        oldPrintBook.setStatus(printBook.getStatus());
        return printBookRepository.save(oldPrintBook);
    }

    @Override
    public void deletePrintBookById(Integer id) {
        this.printBookRepository.deleteById(id);
    }
}
