package com.nvd.library.services.Impl;

import com.nvd.library.pojo.PrintBook;
import com.nvd.library.repository.PrintBookRepository;
import com.nvd.library.services.PrintBookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrintBookServiceImpl implements PrintBookService {

    @Autowired
    private PrintBookRepository printBookRepository;
    @Override
    public List<PrintBook> getPrintBooks() {
        return printBookRepository.findAll();
    }

    @Override
    public List<PrintBook> getPrintBooksByBook_Id(Integer id) {
        return printBookRepository.findPrintBookByBook_Id(id);
    }

    @Override
    public PrintBook getPrintBookById(Integer id) {
        return printBookRepository.findById(id).orElseThrow(() -> new RuntimeException("PrintBook not found"));
    }

    @Override
    public PrintBook addPrintBook(PrintBook printBook) {
        return printBookRepository.save(printBook);
    }

    @Override
    public PrintBook updatePrintBook(PrintBook printBook) {
        return printBookRepository.save(printBook);
    }

    @Override
    public void deletePrintBookById(Integer id) {
        this.printBookRepository.deleteById(id);
    }
}
