package com.nvd.library.services;

import com.nvd.library.pojo.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService extends UserDetailsService {
    public UserDetails loadUserByUsername(String username);
    public List<User> getAllUser();
    public User getUserById(int id);
    public User getUserByUsername(String username);
    public User addOrUpdateUser(com.nvd.library.pojo.User u);
    public void deleteUser(User user);
    public boolean authenticate(String username, String password);
    List<User> findAllReaderUsers();
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
