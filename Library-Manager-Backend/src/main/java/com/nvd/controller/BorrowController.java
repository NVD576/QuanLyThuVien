package com.nvd.controller;

import com.nvd.entity.Borrow;
import com.nvd.service.BorrowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/borrows")
public class BorrowController {
    @Autowired
    private BorrowService borrowService;

    @GetMapping
    public List<Borrow> getAll() {
        return borrowService.getAll();
    }

    @GetMapping("/{id}")
    public Borrow getById(@PathVariable Integer id) {
        return borrowService.getById(id);
    }

    @PostMapping
    public Borrow save(@RequestBody Borrow borrow) {
        return borrowService.save(borrow);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        borrowService.delete(id);
    }
} 