package com.nvd.library.repository;

import com.nvd.library.pojo.Fine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface FineRepository extends JpaRepository<Fine,Integer> {
    @Query("SELECT SUM(f.amount) FROM Fine f WHERE f.status = 'Pending'")
    BigDecimal sumPendingFines();

    @Query("SELECT SUM(f.amount) FROM Fine f WHERE f.status = 'Paid'")
    BigDecimal sumPaidFines();

    @Query("SELECT f FROM Fine f WHERE f.borrow.user.id = :userId")
    List<Fine> findByUserId(@Param("userId") Integer userId);
    Fine getFinesById(Integer id);

    // Tổng tiền phạt chưa trả trong khoảng thời gian
    @Query("SELECT COALESCE(SUM(f.amount), 0) FROM Fine f " +
            "WHERE f.status <> 'Paid' AND f.issueDate BETWEEN :startDate AND :endDate")
    BigDecimal sumPendingFinesByDateRange(@Param("startDate") LocalDate startDate,
                                          @Param("endDate") LocalDate endDate);

    // Tổng tiền phạt đã trả trong khoảng thời gian
    @Query("SELECT COALESCE(SUM(f.amount), 0) FROM Fine f " +
            "WHERE f.status = 'Paid' AND f.paidDate BETWEEN :startDate AND :endDate")
    BigDecimal sumPaidFinesByDateRange(@Param("startDate") LocalDate startDate,
                                       @Param("endDate") LocalDate endDate);

    Fine findByBorrow_Id(int borrowId);
}
