package com.nvd.library.repository;

import com.nvd.library.pojo.Librarian;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LibrarianRepository extends JpaRepository<Librarian, Integer> {
    @Query("SELECT l FROM Librarian l JOIN l.user u " +
            "WHERE u.firstName LIKE %:keyword% OR u.lastName LIKE %:keyword% OR " +
            "u.email LIKE %:keyword% OR u.phone LIKE %:keyword% OR u.address LIKE %:keyword%")
    Page<Librarian> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
}
