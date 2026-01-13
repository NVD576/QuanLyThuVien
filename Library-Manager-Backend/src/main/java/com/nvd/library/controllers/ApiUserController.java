package com.nvd.library.controllers;

import com.nvd.library.dto.ChangePasswordDTO;
import com.nvd.library.dto.LoginDTO;
import com.nvd.library.dto.ReaderDTO;
import com.nvd.library.dto.UserDTO;
import com.nvd.library.pojo.Reader;
import com.nvd.library.pojo.User;
import com.nvd.library.services.ReaderService;
import com.nvd.library.services.UserService;
import com.nvd.library.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ApiUserController {
    @Autowired
    private UserService userService;
    @Autowired
    private ReaderService readerService;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUser(){
        return ResponseEntity.ok(this.userService.getAllUser());
    }



    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable int id){
        return ResponseEntity.ok(this.userService.getUserById(id));
    }

    @PostMapping("/users/add")
    public ResponseEntity<?> addUser(@ModelAttribute UserDTO userDTO) {
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
        user.setEmail(userDTO.getEmail());
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setPhone(userDTO.getPhone());
        user.setRole(userDTO.getRole());
        user.setAddress(userDTO.getAddress());
        user.setCreatedAt(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant());

        if (userDTO.getFile() != null && !userDTO.getFile().isEmpty()) {
            user.setFile(userDTO.getFile());
        }

        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            user.setPassword(this.passwordEncoder.encode(userDTO.getPassword()));
        }

        return ResponseEntity.ok(this.userService.addOrUpdateUser(user));
    }


    @PatchMapping("/users/{id}/update")
    public ResponseEntity<?> updateUser(@ModelAttribute UserDTO userDTO, @PathVariable int id){
        User user=null;

        try {
           user= this.userService.getUserById(userDTO.getId());

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


       }catch (Exception e){
           throw  new IllegalArgumentException(e);
       }
        return ResponseEntity.ok(this.userService.addOrUpdateUser(user));
    }

    @PatchMapping("/secure/change-password")
    public ResponseEntity<?> changeOwnPassword(
            Principal principal,
            @RequestBody ChangePasswordDTO changePasswordDTO) {

        User user = this.userService.getUserByUsername(principal.getName());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy người dùng");
        }

        // Kiểm tra mật khẩu cũ
        if (!passwordEncoder.matches(changePasswordDTO.getOldPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Mật khẩu cũ không chính xác");
        }

        // Đổi mật khẩu
        user.setPassword(passwordEncoder.encode(changePasswordDTO.getNewPassword()));
        this.userService.addOrUpdateUser(user);

        return ResponseEntity.ok("Đổi mật khẩu thành công");
    }


    @DeleteMapping("/users/{id}/delete")
    public ResponseEntity<String> deleteUser(@PathVariable int id){
        User user = this.userService.getUserById(id);
        this.userService.deleteUser(user);
        return ResponseEntity.ok("ok");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO u) {
        if (u.getUsername() == null || u.getPassword() == null) {
            return ResponseEntity.badRequest().body("Username hoặc password không được để trống");
        }

        if (this.userService.authenticate(u.getUsername(), u.getPassword())) {

            try {
                String token = JwtUtils.generateToken(u.getUsername());
                return ResponseEntity.ok().body(Collections.singletonMap("token", token));
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Lỗi khi tạo JWT");
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sai thông tin đăng nhập");
    }


    @PostMapping("/register")
    public ResponseEntity<?> addReader(@ModelAttribute ReaderDTO userDTO){
        if (userService.existsByUsername(userDTO.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Username đã tồn tại");
        }


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
        reader.setMembershipLevel("Basic");
        readerService.addReader(reader);
        return ResponseEntity.ok(reader);
    }

    @RequestMapping("/secure/profile")
    @ResponseBody
    @CrossOrigin
    public ResponseEntity<User> getProfile(Principal principal) {
        return new ResponseEntity<>(this.userService.getUserByUsername(principal.getName()), HttpStatus.OK);
    }
}