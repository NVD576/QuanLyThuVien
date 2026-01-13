package com.nvd.library.services;

import com.nvd.library.pojo.PrintBook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PrintBookService {
    Page<PrintBook> getAllPrintBooks(Pageable pageable, Long bookId, String title);
    List<PrintBook> getPrintBooksByBook_Id(Integer id);
    PrintBook getPrintBookById(Integer id);
    PrintBook addPrintBook(PrintBook printBook);
    PrintBook updatePrintBook(PrintBook printBook);
    void deletePrintBookById(Integer id);
}
