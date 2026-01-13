package com.nvd.library.controllers;


import com.nvd.library.dto.ReaderDTO;
import com.nvd.library.dto.UpgradeRequestDTO;
import com.nvd.library.dto.UserDTO;
import com.nvd.library.pojo.Reader;
import com.nvd.library.pojo.User;
import com.nvd.library.services.ReaderService;
import com.nvd.library.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ApiReaderController {
    @Autowired
    private ReaderService readerService;
    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/readers")
    public ResponseEntity<Page<Reader>> getReaders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<Reader> readers = readerService.getReaders(keyword, pageable);

        return ResponseEntity.ok(readers);
    }
    @PostMapping("/reader/add")
    public ResponseEntity<?> addReader(@ModelAttribute ReaderDTO userDTO){
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
        user.setRole("Reader");
        user.setIsActive(true);
        user.setCreatedAt(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant());
        if (userDTO.getFile() != null && !userDTO.getFile().isEmpty()) {
            user.setFile(userDTO.getFile());
        }

        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            user.setPassword(this.passwordEncoder.encode(userDTO.getPassword()));
        }
        User u = this.userService.addOrUpdateUser(user);
        Reader reader = new Reader();
        reader.setUser(u);
        reader.setMembershipLevel(userDTO.getMembershipLevel());
        readerService.addReader(reader);
        return ResponseEntity.ok(reader);
    }

    @GetMapping("/reader/{id}")
    public ResponseEntity<Reader> getReaderById(@PathVariable int id){
        return ResponseEntity.ok(this.readerService.getReaderById(id));
    }
    @PostMapping("/reader/upgradeLevel")
    public ResponseEntity<?> upgradeMembership(@RequestBody UpgradeRequestDTO request) {
        try {
            readerService.upgradeMembershipWithPayment(request);
            return ResponseEntity.ok("Nâng hạng và tạo payment thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi: " + e.getMessage());
        }
    }

    @PatchMapping("/reader/update")
    public ResponseEntity<?> updateReader(@ModelAttribute ReaderDTO userDTO){
        User user = this.userService.getUserById(userDTO.getId()    );


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
        if (userDTO.getEmail() != null) {
            user.setEmail(userDTO.getEmail());
        }
        if (userDTO.getFirstName() != null) {
            user.setFirstName(userDTO.getFirstName());
        }
        if (userDTO.getLastName() != null) {
            user.setLastName(userDTO.getLastName());
        }
        if (userDTO.getPhone() != null) {
            user.setPhone(userDTO.getPhone());
        }
        if (userDTO.getAddress() != null) {
            user.setAddress(userDTO.getAddress());
        }
        if (userDTO.getIsActive() != null) {
            user.setIsActive(userDTO.getIsActive());
        }

        if (userDTO.getFile() != null && !userDTO.getFile().isEmpty()) {
            user.setFile(userDTO.getFile());
        }

        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            user.setPassword(this.passwordEncoder.encode(userDTO.getPassword()));
        }
        User u = this.userService.addOrUpdateUser(user);
        Reader reader = this.readerService.getReaderById(u.getId());
        reader.setUser(u);
        reader.setMembershipLevel(userDTO.getMembershipLevel());
        readerService.addReader(reader);
        return ResponseEntity.ok(reader);

    }
    @DeleteMapping("/reader/{id}/delete")
    public ResponseEntity<Reader> deleteReader(@PathVariable int id){
        Reader r= this.readerService.getReaderById(id);
        this.readerService.deleteReaderById(r.getId());
        this.userService.deleteUser(r.getUser());
        return ResponseEntity.ok(r);
    }


}
