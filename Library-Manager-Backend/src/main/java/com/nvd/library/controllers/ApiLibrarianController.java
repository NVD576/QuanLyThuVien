package com.nvd.library.controllers;


import com.nvd.library.dto.LibrarianDTO;
import com.nvd.library.dto.UserDTO;
import com.nvd.library.pojo.Librarian;
import com.nvd.library.pojo.User;
import com.nvd.library.services.LibrarianService;
import com.nvd.library.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneId;

@RestController
@RequestMapping("/api")
public class ApiLibrarianController {
    @Autowired
    private LibrarianService librarianService;
    @Autowired
    private UserService userService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/librarians")
    public Page<Librarian> getAllLibrarians(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Pageable pageable = PageRequest.of(page, size);

        return librarianService.getLibrarians(keyword, pageable);
    }

    @GetMapping("/librarian/{id}")
    public ResponseEntity<Librarian> getLibrarianById(@PathVariable int id){
        return ResponseEntity.ok(this.librarianService.getLibrarianById(id));
    }

    @PostMapping("/librarian/add")
    public ResponseEntity<?> addLibrarian(@ModelAttribute LibrarianDTO userDTO){
        if (userService.existsByUsername(userDTO.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Username đã tồn tại");
        }

        // Kiểm tra email
        if (userService.existsByEmail(userDTO.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Email đã tồn tại");
        }
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setPassword(userDTO.getPassword());
        user.setEmail(userDTO.getEmail());
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setPhone(userDTO.getPhone());
        user.setAddress(userDTO.getAddress());
        user.setRole("Librarian");
        user.setIsActive(true);
        user.setCreatedAt(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant());
        if (userDTO.getFile() != null && !userDTO.getFile().isEmpty()) {
            user.setFile(userDTO.getFile());
        }

        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            user.setPassword(this.passwordEncoder.encode(userDTO.getPassword()));
        }
        User u = this.userService.addOrUpdateUser(user);
        Librarian librarian = new Librarian();
        librarian.setUser(u);
        librarian.setStartDate(userDTO.getStartDate());
        librarianService.addLibrarian(librarian);
        return ResponseEntity.ok(librarian);
    }

    @PatchMapping("/librarian/update")
    public ResponseEntity<?> updateLibrarian(@ModelAttribute LibrarianDTO userDTO){

        User user = this.userService.getUserById(userDTO.getId());

        if (!user.getUsername().equals(userDTO.getUsername()) && userService.existsByUsername(userDTO.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Username đã tồn tại");
        }

        if (!user.getEmail().equals(userDTO.getEmail()) && userService.existsByEmail(userDTO.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Email đã tồn tại");
        }
        if(userDTO.getUsername()!=null){
            user.setUsername(userDTO.getUsername());
        }
        user.setEmail(userDTO.getEmail());
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setPhone(userDTO.getPhone());
        user.setAddress(userDTO.getAddress());
        user.setIsActive(userDTO.getIsActive());
        user.setCreatedAt(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant());
        if (userDTO.getFile() != null && !userDTO.getFile().isEmpty()) {
            user.setFile(userDTO.getFile());
        }

        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            user.setPassword(this.passwordEncoder.encode(userDTO.getPassword()));
        }
        User u = this.userService.addOrUpdateUser(user);
        Librarian librarian = this.librarianService.getLibrarianById(u.getId());
        librarian.setUser(u);
        librarian.setStartDate(userDTO.getStartDate());
        librarianService.updateLibrarian(librarian);
        return ResponseEntity.ok(librarian);
    }
    @DeleteMapping("/librarian/{id}/delete")
    public ResponseEntity<String> deleteLibrarian(@PathVariable int id){
        this.librarianService.deleteLibrarianById(id);
        return ResponseEntity.ok("Deleted");
    }
}
