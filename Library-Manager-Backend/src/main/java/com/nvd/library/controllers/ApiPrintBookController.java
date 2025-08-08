package com.nvd.library.controllers;

import com.nvd.library.pojo.PrintBook;
import com.nvd.library.services.PrintBookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ApiPrintBookController {
    @Autowired
    private PrintBookService printBookService;

    @GetMapping("/printBooks")
    public ResponseEntity<List<PrintBook>> getPrintBooks(){
        return ResponseEntity.ok(this.printBookService.getPrintBooks());
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
    public ResponseEntity<PrintBook> addPrintBook(@RequestBody PrintBook printBook){
        return ResponseEntity.ok(this.printBookService.addPrintBook(printBook));
    }

    @PatchMapping("/printBook/update")
    public ResponseEntity<PrintBook> updatePrintBook(@RequestBody PrintBook printBook){
        return ResponseEntity.ok(this.printBookService.updatePrintBook(printBook));
    }

    @DeleteMapping("/printBook/{id}/delete")
    public ResponseEntity<String> deletePrintBook(@PathVariable Integer id){
        this.printBookService.deletePrintBookById(id);
        return ResponseEntity.ok("Deleted");
    }

}
