package com.nvd.library.repository;

import com.nvd.library.pojo.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);


    @Query("SELECT r.user FROM Reader r")
    List<User> findAllReaderUsers();
}