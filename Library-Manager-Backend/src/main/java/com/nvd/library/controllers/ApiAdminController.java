package com.nvd.library.controllers;

import com.nvd.library.dto.UserDTO;
import com.nvd.library.pojo.Admin;
import com.nvd.library.pojo.Reader;
import com.nvd.library.pojo.User;
import com.nvd.library.services.AdminService;
import com.nvd.library.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ApiAdminController {
    @Autowired
    private AdminService adminService;
    @Autowired
    private UserService userService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/admins")
    public ResponseEntity<List<Admin>> getAllAdmin(){
        return ResponseEntity.ok(this.adminService.getAllAdmin());
    }

    @GetMapping("/admins/{id}")
    public ResponseEntity<Admin> getAdminById(@PathVariable int id){
        return ResponseEntity.ok(this.adminService.getAdminById(id));
    }


    @PostMapping("/admins/add")
    public ResponseEntity<?> addAdmin(@ModelAttribute UserDTO userDTO){
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
        user.setRole("Admin");
        user.setIsActive(true);
        user.setCreatedAt(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant());
        if (userDTO.getFile() != null && !userDTO.getFile().isEmpty()) {
            user.setFile(userDTO.getFile());
        }

        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            user.setPassword(this.passwordEncoder.encode(userDTO.getPassword()));
        }
        User u = this.userService.addOrUpdateUser(user);
        Admin admin = new Admin();
        admin.setUser(u);
        adminService.addAdmin(admin);
        return ResponseEntity.ok(admin);
    }

    @PatchMapping("/admins/update")
    public ResponseEntity<?> updateAdmin(@ModelAttribute Admin admin) {

        User user = this.userService.getUserById(admin.getUser().getId());


        if (!user.getUsername().equals(admin.getUser().getUsername()) && userService.existsByUsername(admin.getUser().getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Username đã tồn tại");
        }

        if (!user.getEmail().equals(admin.getUser().getEmail()) && userService.existsByEmail(admin.getUser().getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Email đã tồn tại");
        }
        if(admin.getUser().getUsername()!=null){
            user.setUsername(admin.getUser().getUsername());
        }
        user.setEmail(admin.getUser().getEmail());
        user.setFirstName(admin.getUser().getFirstName());
        user.setLastName(admin.getUser().getLastName());
        user.setPhone(admin.getUser().getPhone());
        user.setAddress(admin.getUser().getAddress());
        if (admin.getUser().getFile() != null && !admin.getUser().getFile().isEmpty()) {
            user.setFile(admin.getUser().getFile());
        }
        this.userService.addOrUpdateUser(user);
        admin.setUser(user);
        return ResponseEntity.ok( adminService.updateAdmin(admin));
    }

    @DeleteMapping("/admins/{id}/delete")
    public ResponseEntity<String> deleteAdmin(@PathVariable int id){
        try{
            Admin admin = this.adminService.getAdminById(id);
            adminService.deleteAdmin(admin);
            this.userService.deleteUser(admin.getUser());
        }catch (Exception e){
            e.printStackTrace();
        }

        return ResponseEntity.ok("ok");
    }
}