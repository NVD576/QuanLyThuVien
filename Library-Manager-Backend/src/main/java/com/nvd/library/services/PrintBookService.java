package com.nvd.library.services;

import com.nvd.library.pojo.PrintBook;

import java.util.List;

public interface PrintBookService {
    List<PrintBook> getPrintBooks();
    List<PrintBook> getPrintBooksByBook_Id(Integer id);
    PrintBook getPrintBookById(Integer id);
    PrintBook addPrintBook(PrintBook printBook);
    PrintBook updatePrintBook(PrintBook printBook);
    void deletePrintBookById(Integer id);
}
