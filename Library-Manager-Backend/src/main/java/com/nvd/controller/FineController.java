package com.nvd.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nvd.entity.Fine;
import com.nvd.service.FineService;

@RestController
@RequestMapping("/api/fines")
public class FineController {
    @Autowired
    private FineService fineService;

    @GetMapping
    public List<Fine> getAll() {
        return fineService.getAll();
    }

    @GetMapping("/{id}")
    public Fine getById(@PathVariable Integer id) {
        return fineService.getById(id);
    }

    @PostMapping
    public Fine save(@RequestBody Fine fine) {
        return fineService.save(fine);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        fineService.delete(id);
    }
} 