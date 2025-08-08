package com.nvd.library.controllers;


import com.nvd.library.dto.ReaderDTO;
import com.nvd.library.dto.UserDTO;
import com.nvd.library.pojo.Reader;
import com.nvd.library.pojo.User;
import com.nvd.library.services.ReaderService;
import com.nvd.library.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public ResponseEntity<List<Reader>> getMembers(){
        return ResponseEntity.ok(this.readerService.getAllReaders());
    }

    @PostMapping("/reader/add")
    public ResponseEntity<Reader> addReader(@ModelAttribute ReaderDTO userDTO){
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

    @PatchMapping("/reader/update")
    public ResponseEntity<Reader> updateReader(@RequestBody Reader reader){
        Reader r= this.readerService.getReaderById(reader.getId());
        r.setMembershipLevel(reader.getMembershipLevel());
        return ResponseEntity.ok( readerService.updateReader(r));

    }
    @DeleteMapping("/reader/{id}/delete")
    public ResponseEntity<Reader> deleteReader(@PathVariable int id){
        Reader r= this.readerService.getReaderById(id);
        this.readerService.deleteReaderById(r.getId());
        return ResponseEntity.ok(r);
    }


}
