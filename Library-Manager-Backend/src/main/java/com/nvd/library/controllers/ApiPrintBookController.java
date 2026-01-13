package com.nvd.library.controllers;

import com.nvd.library.dto.PrintBookDTO;
import com.nvd.library.pojo.Book;
import com.nvd.library.pojo.PrintBook;
import com.nvd.library.repository.BookRepository;
import com.nvd.library.services.BookService;
import com.nvd.library.services.PrintBookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiPrintBookController {
    @Autowired
    private PrintBookService printBookService;
    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private BookService bookService;
    @GetMapping("/printBooks")
    public ResponseEntity<Map<String, Object>> getAllPrintBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long bookId,
            @RequestParam(required = false) String title
    ) {
        Pageable pageable = PageRequest.of(page, size,  Sort.by(Sort.Direction.DESC, "id"));
        Page<PrintBook> pagePrintBooks = printBookService.getAllPrintBooks(pageable, bookId, title);

        Map<String, Object> response = new HashMap<>();
        response.put("content", pagePrintBooks.getContent());
        response.put("currentPage", pagePrintBooks.getNumber());
        response.put("totalItems", pagePrintBooks.getTotalElements());
        response.put("totalPages", pagePrintBooks.getTotalPages());
        response.put("pageSize", pagePrintBooks.getSize());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/printBook/{id}")
    public ResponseEntity<PrintBook> getPrintBookById(@PathVariable Integer id) {
        return  ResponseEntity.ok(this.printBookService.getPrintBookById(id));
    }

    @GetMapping("/printBook/{id}/bookId")
    public ResponseEntity<List<PrintBook>> getPrintBooksByBookId(@PathVariable Integer id) {
        return ResponseEntity.ok(this.printBookService.getPrintBooksByBook_Id(id));
    }

    @PostMapping("/printBook/add")
    public ResponseEntity<PrintBook> addPrintBook(@RequestBody PrintBookDTO printBookDTO){
        Book book = bookService.getBookById(printBookDTO.getBookId());
        book.setTotalCopies(book.getTotalCopies()+1);
        book.setAvailableCopies(book.getAvailableCopies()+1);
        bookRepository.save(book);
        PrintBook printBook = new PrintBook();
        printBook.setBook(book);
        printBook.setStatus(printBookDTO.getStatus());
        return ResponseEntity.ok(this.printBookService.addPrintBook(printBook));
    }

    @PatchMapping("/printBook/update")
    public ResponseEntity<PrintBook> updatePrintBook(@RequestBody PrintBookDTO printBookDTO){
        PrintBook printBook = printBookService.getPrintBookById(printBookDTO.getId());
        printBook.setStatus(printBookDTO.getStatus());
        return ResponseEntity.ok(this.printBookService.updatePrintBook(printBook));
    }

    @DeleteMapping("/printBook/{id}/delete")
    public ResponseEntity<String> deletePrintBook(@PathVariable Integer id){
        PrintBook printBook = printBookService.getPrintBookById(id);
        try{
            this.printBookService.deletePrintBookById(printBook.getId());
            Book book = bookService.getBookById(printBook.getBook().getId());
            book.setTotalCopies(book.getTotalCopies()-1);
            book.setAvailableCopies(book.getAvailableCopies()-1);
            bookRepository.save(book);
        }catch(Exception e){
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok("Deleted");
    }

}
