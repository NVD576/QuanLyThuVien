package com.nvd.library.repository;

import com.nvd.library.pojo.Borrow;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BorrowRepository  extends JpaRepository<Borrow, Integer> {
    List<Borrow> findByUserId(Integer userId);
    List<Borrow> findByPrintBookId(Integer bookId);
    List<Borrow> findByUser_IdAndPrintBook_Book_Id(Integer userId, Integer bookId);
    @Query("""
    SELECT b FROM Borrow b
    WHERE LOWER(CONCAT(b.user.firstName, ' ', b.user.lastName)) LIKE LOWER(CONCAT('%', :keyword, '%'))
    OR LOWER(b.printBook.book.title) LIKE LOWER(CONCAT('%', :keyword, '%'))""")
    Page<Borrow> searchByUserOrBook(@Param("keyword") String keyword, Pageable pageable);
    long countByStatus(String status);

    @Query("SELECT COUNT(b) FROM Borrow b WHERE (b.status = 'Borrowed' ) AND b.dueDate < CURRENT_DATE")
    long countOverdueBorrows();

    List<Borrow> findByDueDateBeforeAndReturnDateIsNull(LocalDate date);

    @Query("SELECT COUNT(b) FROM Borrow b WHERE b.user.id = :userId AND (b.status = 'Borrowed' OR b.status = 'Pending')")
    int countActiveBorrowsByUser(@Param("userId") Integer userId);



    @Query("SELECT COUNT(b) FROM Borrow b WHERE b.dueDate < CURRENT_DATE AND b.borrowDate BETWEEN :startDate AND :endDate")
    long countOverdueByDateRange(@Param("startDate") LocalDate startDate,
                                 @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(b) FROM Borrow b WHERE b.status = :status AND b.borrowDate BETWEEN :startDate AND :endDate")
    long countByStatusAndDateRange(@Param("status") String status,
                                   @Param("startDate") LocalDate startDate,
                                   @Param("endDate") LocalDate endDate);

    @Query("SELECT pb.book AS book, COUNT(b.id) AS borrowCount " +
            "FROM Borrow b JOIN b.printBook pb " +
            "GROUP BY pb.book " +
            "ORDER BY COUNT(b.id) DESC")
    List<Object[]> findTopMostBorrowedBooks();


    @Query("""
    SELECT b FROM Borrow b
    WHERE (:status IS NULL OR :status = '' OR b.status = :status)
      AND (
            :keyword IS NULL OR :keyword = ''
            OR LOWER(b.user.firstName) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(b.user.lastName) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(b.printBook.book.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
          )
    """)
    Page<Borrow> searchBorrows(@Param("status") String status,
                               @Param("keyword") String keyword,
                               Pageable pageable);

}
