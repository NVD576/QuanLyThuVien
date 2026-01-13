package com.nvd.library.repository;

import com.nvd.library.pojo.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    @Query("SELECT p FROM Payment p " +
            "JOIN p.user u " +
            "WHERE (:userId IS NULL OR p.user.id = :userId) " +
            "AND (:startDate IS NULL OR p.paymentDate >= :startDate) " +
            "AND (:endDate IS NULL OR p.paymentDate <= :endDate) " +
            "AND (:search IS NULL OR LOWER(CONCAT(u.firstName, ' ', u.lastName)) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Payment> findByFilters(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("search") String search,
            Pageable pageable
    );
}
