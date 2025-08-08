package com.nvd.library.controllers;

import com.nvd.library.pojo.Category;
import com.nvd.library.services.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ApiCategoryController {
    @Autowired
    private CategoryService categoryService;

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAllCategories(){
        return new ResponseEntity<>(this.categoryService.getAllCategories(), HttpStatus.OK);
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable int id){
        return ResponseEntity.ok(this.categoryService.getCategoryById(id));
    }

    @PostMapping("/categories/add")
    public ResponseEntity<Category> addCategory(@RequestBody Category category){
        return ResponseEntity.ok(this.categoryService.addCategory(category));
    }

    @PatchMapping("/categories/update")
    public ResponseEntity<Category> updateCategory(@RequestBody Category category){
        return ResponseEntity.ok(this.categoryService.updateCategory(category));
    }

    @DeleteMapping("/categories/{id}/delete")
    public ResponseEntity<String> deleteCategoryById(@PathVariable int id){
        this.categoryService.deleteCategoryById(id);
        return ResponseEntity.ok("Deleted");
    }

}
