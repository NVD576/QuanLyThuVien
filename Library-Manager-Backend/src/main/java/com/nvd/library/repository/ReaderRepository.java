package com.nvd.library.repository;

import com.nvd.library.pojo.Reader;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReaderRepository extends JpaRepository<Reader, Integer> {
    Page<Reader> findByUser_FirstNameContainingIgnoreCaseOrUser_LastNameContainingIgnoreCaseOrUser_EmailContainingIgnoreCaseOrUser_PhoneContainingIgnoreCaseOrUser_AddressContainingIgnoreCase(
            String firstName,
            String lastName,
            String email,
            String phone,
            String address,
            Pageable pageable
    );

}